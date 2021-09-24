let file = '../static/causalexp/test_sy.json';
var user_data = [];
var test_order = [];
var current_sample_selection = [];
var estimations = [];
var predictions = [];
var sample_order = [];
var mutation_prediction = [];
// let scenarios = shuffle(['mouse','rabbit','pigeon']);
let scenarios = ['mouse','rabbit','pigeon'];
let image_type = ["p", "notp", "q", "notq"];
// img_combination = new Array();
let img_combination = {
    'a': {'cause': 'p', 'effect': 'q'},
    'b': {'cause': 'p', 'effect': 'notq'},
    'c': {'cause': 'notp', 'effect': 'q'},
    'd': {'cause': 'notp', 'effect': 'notq'}
}
let stim_dict = {
    'a': {'cause': 1, 'effect': 1},
    'b': {'cause': 1, 'effect': 0},
    'c': {'cause': 0, 'effect': 1},
    'd': {'cause': 0, 'effect': 0}
}
var flag = 0; // シナリオの初回表示判定に使用
var current_test_order = 0;
var current_test_page = 0; // 何事例目か
var sample_size = 0; // 現在の設問の事例の総数
var user_id = 0;
var start_time = getNow();
var sce_idx = 0;  // 動物の判別
var pred_i = 0;
var EST_INTERVAL = 10;
var cell_size = 0;

// 読み込み時に実行される
// read_json(): jsonファイルを読み込む
// getImages(): 画像のプリロード
// to_next_scenario_description(): シナリオの表示
window.onload = function() {
    // ランダム数列の発行
    user_id = Math.round(Math.random() * 100000000);
    user_id = zeroPadding(user_id, 8);
    test_order = read_json(file);
    estimations = new Array();
    getImages();
    to_next_scenario_description(is_first_time=true);
}

function read_json(filename) {
    var json = $.ajax({
        type: 'GET',
        url: filename,
        async: false,
        dataType: 'json'
    }).responseText;
    return JSON.parse(json);
}

function getImages() {
    for (scenario in scenarios){
        for(type in image_type){
            var img = document.createElement('img');
            img.src = `../${test_order[scenarios[scenario]]['images'][image_type[type]]}`;
        }
    }
    document.getElementById('preload_image').style.display = "none";
}

// 表示・非表示処理多すぎて見づらかったので一括で処理
// 消えないのあったら適宜追加
function clear_page() {
    document.getElementById('estimate_input_area').style.display = "none";
    document.getElementById('check_sentence').style.display = "none";
    document.getElementById('description_area').style.display = "none";
    document.getElementById('show_sample_area').style.display = 'none';
}

// シナリオの表示
function to_next_scenario_description(is_first_time=false) {
    clear_page();
    if (!is_first_time){
        sce_idx++;
    }
    document.getElementById('scenario_title').innerHTML = test_order[scenarios[sce_idx]]['jp_name'] + 
        "に" + test_order[scenarios[sce_idx]]['chemicals'] + "という化学物質を投与した時の実験記録";
    document.getElementById('Q_select_button').innerHTML = "<h2>Q. 上記の結果を見て" + 
        test_order[scenarios[sce_idx]]['jp_name'] + "の遺伝子が突然変異したかどうか、正しいと思う方のボタンを直感で選択してください</h2>";
    document.getElementById('check_sentence').style.display = "inline-block";
    document.getElementById('description_area').style.display = "inline-block";
    document.getElementById('description_area_first').style.display = "inline-block";
    let desc_len = test_order[scenarios[sce_idx]]['descriptions'].length;
    for (let i = 0; i < desc_len; i++) {
        document.getElementById('scenario_description'+String(i+1)).innerHTML = test_order[scenarios[sce_idx]]['descriptions'][i];
    }
}

// チェックが入っているか確認する
function check_description() {
    let checks = document.getElementsByClassName("checks");
    let count = 0;
    for (let i = 0 ; i < checks.length ; i++) {
        if (checks[i].checked) count++;
    }
    if (count == checks.length) {
        document.getElementById('start_scenario_button').removeAttribute("disabled");
    }
}

// 進捗バーを更新する関数
function progress_bar(){
    document.getElementById('progress_bar').value = current_test_page;
    document.getElementById('progress_bar').max = sample_size;
}

// 事例を表示する画面へ遷移
function to_next_new_sample_page() {
    clear_page();
    current_test_page = 0;
    document.getElementById('show_sample_area').style.display = "inline";
    document.getElementById('sample_after').style.display = "none";
    document.getElementById('last_sentence').style.display = "none";

    // 提示するサンプルのリストを作り、サンプルサイズを求める。
    current_sample_selection = [];
    sample_size = 0;
    Object.keys(test_order[scenarios[sce_idx]]['samples']['frequency']).forEach(function(elm) {
        if (test_order[scenarios[sce_idx]]['samples']['frequency'][elm] > 0) {
            sample_size += test_order[scenarios[sce_idx]]['samples']['frequency'][elm];
            cell_size = test_order[scenarios[sce_idx]]['samples']['frequency'][elm];
            for (let i = 0 ; i < cell_size ; i++) {
                current_sample_selection.push(elm);
            }
        }
    });
    current_sample_selection = shuffle(current_sample_selection);

    to_next_sample();
}

// 次の事例があるか確認し、存在しない場合は推定画面へ遷移
function to_next_sample() {
    if (current_test_page >= sample_size) {
        alert('この動物の実験結果は以上になります。');
        draw_estimate('fin');
        return;
    }
    // 10刺激ごとに因果関係の強さを聞く
    else if(current_test_page % EST_INTERVAL == 0 && current_test_page != 0 && current_test_page != sample_size){
        alert('回答ページへ移ります。');
        draw_estimate('mid');
        return;
    }
    select_next_sample();
}

function select_next_sample() {
    var sample = current_sample_selection[pred_i];
    var desc = test_order[scenarios[sce_idx]]['sentences'][sample];
    desc = desc.split('、');
    document.getElementById('first_sentence').innerHTML = desc[0];
    document.getElementById('last_sentence').innerHTML = desc[1];
    document.getElementById('estimate_input_area').style.display = 'none';
    document.getElementById('show_sample_area').style.display = "inline";
    document.getElementById('first_sentence').style.display = 'inline';
    document.getElementById('sample_before').style.display = 'inline';
    document.getElementById('predict_effect').style.display = 'inline';
    document.getElementById('Q_select_button').style.display = 'inline';
    document.getElementById('last_sentence').style.display = 'none';
    document.getElementById('sample_after').style.display = 'none';
    document.getElementById('next_sample').style.display = 'none';
    document.getElementById('Ans_select_button').style.display = 'none';
    document.getElementById('sample_before').src = `../${test_order[scenarios[sce_idx]]['images'][img_combination[sample]['cause']]}`;
    document.getElementById('sample_after').src = `../${test_order[scenarios[sce_idx]]['images'][img_combination[sample]['effect']]}`;
    // 進捗バー更新
    progress_bar();
    current_test_page++;
}

function show_back_sample(is_mutate) {
    let stim = current_sample_selection[pred_i];

    append_prediction(
        pred_i=pred_i,
        stimulation=stim,
        cause=stim_dict[stim]['cause'],
        effect=stim_dict[stim]['effect'], 
        prediction=is_mutate
    );
    pred_i++;
    pred_i %= sample_size;
    console.log("show_back: " + String(pred_i));
    
    document.getElementById('first_sentence').style.display = 'none';
    document.getElementById('sample_before').style.display = 'none';
    document.getElementById('predict_effect').style.display = 'none';
    document.getElementById('Q_select_button').style.display = 'none';
    document.getElementById('Ans_select_button').style.display = 'inline';
    document.getElementById('last_sentence').style.display = 'inline';
    document.getElementById('sample_after').style.display = 'inline';
    document.getElementById('next_sample').style.display = 'inline';
}

function draw_estimate(c) {
    clear_page();
    document.getElementById('checkbox').setAttribute("disabled",true);
    document.getElementById('next_scenario').style.display = 'none';
    document.getElementById('estimate_input_area').style.display = 'inline-block';
    document.getElementById('next_scenario').setAttribute("disabled", true);
    document.getElementById('continue_scenario').style.display = 'inline';
    document.getElementById('estimate_slider').value = 50;
    document.getElementById('estimate').innerHTML = 50;
    document.getElementById('checkbox').checked = false;

    if (c=='fin'){
        document.getElementById('continue_scenario').style.display = 'none';
        if (sce_idx == scenarios.length - 1){
            document.getElementById('finish_all_scenarios').style.display = 'inline';
        } else {
            document.getElementById('next_scenario').style.display = 'inline';
        }
    }

    document.getElementById('estimate_description').innerHTML = 
        '<p>' + test_order[scenarios[sce_idx]]['result'] + 'と思いますか？</p><br>' + 
        '<p>0: ' + test_order[scenarios[sce_idx]]['chemicals'] + 'という化学物質の投与は' +
        test_order[scenarios[sce_idx]]['jp_name'] + 'の遺伝子の変異を全く引き起こさない</p><br>' + 
        '<p>100: ' + test_order[scenarios[sce_idx]]['chemicals'] + 'という化学物質の投与は' +
        test_order[scenarios[sce_idx]]['jp_name'] + 'の遺伝子の変異を確実に引き起こす </p><br>' +
        '<p>として、0から100の値で<b>直感的に</b>回答してください。</p><br>'
}

function get_value() {
    let est_i = parseInt(pred_i / EST_INTERVAL, 10);
    console.log("get_value: " + String(est_i));
    append_estimation(
        est_i=est_i,
        estimation=document.getElementById('estimate_slider').value
    );
}

function get_value_fin() {
    get_value();
    save_estimations();
}

// 推定画面のチェックが入ってるか確認する
// ゲージ操作時にチェックボックスがアクティブ化する処理もまとめてしまったので気になるようなら変更してください
function check_estimate() {
    if (document.getElementById('checkbox').checked) {
        document.getElementById('next_scenario').removeAttribute("disabled");
        document.getElementById('continue_scenario').removeAttribute("disabled");
        document.getElementById('finish_all_scenarios').removeAttribute("disabled");
    } else {
        document.getElementById('checkbox').removeAttribute("disabled");
    }
}

// 回答をスプレッドシートに送信する
function save_estimations() {
    export_user_info();
    export_estimations();
    export_predictions();
    location.href = `../end?id=${user_id}`;
}

// ###############
// ## functions ##
// ###############

function  append_estimation(est_i, estimation) {
    let data = {};
    data['user_id'] = user_id;
    data['animal'] = scenarios[sce_idx];
    console.log("append_est: " + String(est_i));
    data['est_i'] = est_i;
    data['estimation'] = estimation;
    estimations.push(data);
}

function  append_prediction(pred_i, stimulation, cause, effect, prediction) {
    let data = {};
    data['user_id'] = user_id;
    data['animal'] = scenarios[sce_idx];
    console.log("append_pred: " + String(pred_i));
    data['pred_i'] = pred_i;
    data['stimulation'] = stimulation;
    data['cause'] = cause;
    data['effect'] = effect;
    data['prediction'] = prediction;
    predictions.push(data);
}

function export_user_info() {
    let data = {};
    data['user_id'] = user_id;
    data['start_time'] = start_time;
    data['end_time'] = getNow();
    data['user_agent'] = window.navigator.userAgent;
    user_data.push(data);

    $.ajax({
        type: 'POST',
        url: '../sendtoGS/',
        async: false,
        data: {
            'data': JSON.stringify(user_data),
            'file_name': 'user_info'
        },
    }).then(
        function() { // 成功時
            // location.href = `../end?id=${user_id}`;
        },
        function () { // 失敗時
            alert('回答送信プロセスでエラーが発生しました。このページのまま少し時間を置いて再度お試しいただくか、問い合わせしていただきますようお願いします。');
            document.getElementById('estimate_next_scenario').removeAttribute("disabled");
    });
}

function export_estimations() {
    $.ajax({
        type: 'POST',
        url: '../sendtoGS/',
        async: false,
        data: {
            'data': JSON.stringify(estimations),
            'file_name': 'estimations'
        },
    }).then(
        function() { // 成功時
            // location.href = `../end?id=${user_id}`;
        },
        function () { // 失敗時
            alert('回答送信プロセスでエラーが発生しました。このページのまま少し時間を置いて再度お試しいただくか、問い合わせしていただきますようお願いします。');
            document.getElementById('estimate_next_scenario').removeAttribute("disabled");
    });
}

function export_predictions() {
    $.ajax({
        type: 'POST',
        url: '../sendtoGS/',
        async: false,
        data: {
            'data': JSON.stringify(predictions),
            'file_name': 'predictions'
        },
    }).then(
        function() { // 成功時
            // location.href = `../end?id=${user_id}`;
        },
        function () { // 失敗時
            alert('回答送信プロセスでエラーが発生しました。このページのまま少し時間を置いて再度お試しいただくか、問い合わせしていただきますようお願いします。');
            document.getElementById('estimate_next_scenario').removeAttribute("disabled");
    });
}

// 配列内の要素をシャッフルする
// 引用元(https://www.nxworld.net/js-array-shuffle.html)
function shuffle ([...array]) {
    for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 0埋め、ランダム数列の桁数を揃えるため使用している
// 引用元(https://rfs.jp/sb/javascript/js-lab/zeropadding.html)
function zeroPadding(NUM, LEN){
	return ( Array(LEN).join('0') + NUM ).slice( -LEN );
}

// 現在時刻を返す関数
// 引用元(http://www.shurey.com/js/samples/2_msg10.html)
function getNow() {
	var now = new Date();
	var year = now.getFullYear();
	var mon = now.getMonth()+1;  // １を足すこと
	var day = now.getDate();
	var hour = now.getHours();
	var min = now.getMinutes();
	var sec = now.getSeconds();
	var s = year + "/" + mon + "/" + day + " " + hour + ":" + min + ":" + sec; 
	return s;
}