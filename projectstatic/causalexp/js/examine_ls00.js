let file = '../static/causalexp/material_ls00.json';
var user_data = [];
var test_order = [];
var current_sample_selection = [];
var estimations = [];
var predictions = [];
var sample_order = [];
var mutation_prediction = [];
let scenarios = shuffle(['mouse','rabbit','pigeon']);
let bgcolors = shuffle(['#FFFFF0','#FFF0F5','#F0F8FF']);
let image_type = ["p", "notp", "q", "notq"];
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
var correct_count = 0; // predictionの正解数カウント

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

preventBrowserBack();

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
    resetBackGround();
    document.getElementById('page').innerHTML = "<h4>"+ (sce_idx+1) + '/' + scenarios.length +"種類目</h4>";
    document.getElementById('scenario_title').innerHTML = "<h2>" + test_order[scenarios[sce_idx]]['jp_name'] + 
        "に" + test_order[scenarios[sce_idx]]['chemicals'] + "という化学物質を投与した時の実験記録</h2>";
    document.getElementById('pred_button').innerHTML = "<h4>Q. 上記の結果を見て" + 
        test_order[scenarios[sce_idx]]['jp_name'] + "の遺伝子が突然変異したかどうか、正しいと思う方のボタンを直感で選択してください</h4>";
    document.getElementById('check_sentence').style.display = "inline-block";
    document.getElementById('description_area').style.display = "inline-block";
    document.getElementById('start_scenario_button').setAttribute("disabled",true);
    let desc_len = test_order[scenarios[sce_idx]]['descriptions'].length;
    for (let i = 0; i < desc_len; i++) {
        document.getElementById('scenario_description'+String(i+1)).innerHTML = test_order[scenarios[sce_idx]]['descriptions'][i];
    }
}

// チェックが入っているか確認する
function check_description() {
    let checkbox = document.getElementsByClassName("checkbox");
    let count = 0;
    for (let i = 0 ; i < checkbox.length ; i++) {
        if (checkbox[i].checked) count++;
    }
    if (count == checkbox.length) {
        document.getElementById('start_scenario_button').removeAttribute("disabled");
    }
}

// 事例を表示する画面へ遷移
function to_next_new_sample_page() {
    clear_page();
    let list = document.getElementsByClassName("checkbox");
    for (let index = 0; index < list.length; ++index) {
        list[index].checked = false;
    }
    
    current_test_page = 0;
    document.getElementById('show_sample_area').style.display = "inline";
    document.getElementById('sample_after').style.display = "none";
    document.getElementById('last_sentence').style.display = "none";
    document.getElementById('order').innerHTML = test_order[scenarios[sce_idx]]['jp_name'] + "の進捗状況";
    changeBackGround();


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
    document.getElementById('first_sentence').innerHTML = "<h4>" + desc[0] + "</h4>";
    document.getElementById('last_sentence').innerHTML = "<h4>" + desc[1] + "</h4>";
    document.getElementById('show_sample_area').style.display = "inline";
    document.getElementById('first_sentence').style.display = 'inline';
    document.getElementById('sample_before').style.display = 'inline';
    document.getElementById('predict_effect').style.display = 'inline';
    document.getElementById('pred_button').style.display = 'inline';
    document.getElementById('estimate_input_area').style.display = 'none';
    document.getElementById('last_sentence').style.display = 'none';
    document.getElementById('sample_after').style.display = 'none';
    document.getElementById('next_sample').style.display = 'none';
    document.getElementById('pred_ans').style.display = 'none';
    document.getElementById('sample_before').src = `../${test_order[scenarios[sce_idx]]['images'][img_combination[sample]['cause']]}`;
    document.getElementById('sample_after').src = `../${test_order[scenarios[sce_idx]]['images'][img_combination[sample]['effect']]}`;
    // 進捗バー更新
    progress_bar();
    current_test_page++;
}

// 進捗バーを更新する関数
function progress_bar(){
    document.getElementById('progress_bar').value = current_test_page;
    document.getElementById('progress_bar').max = sample_size;
}

// 予測の結果を表示する関数
function show_back_sample(is_mutate) {
    let stim = current_sample_selection[pred_i];
    if (is_mutate == stim_dict[stim]['effect']){
        document.getElementById('pred_ans').innerHTML = '<h2>A. 正解です</h2>';
        document.getElementById('pred_ans').style.display = 'inline';
        correct_count++;
    } else if (is_mutate != stim_dict[stim]['effect']){
        document.getElementById('pred_ans').innerHTML = '<h2>A. 不正解です</h2>';
        document.getElementById('pred_ans').style.display = 'inline';
    }

    append_prediction(
        pred_i=pred_i,
        stimulation=stim,
        cause=stim_dict[stim]['cause'],
        effect=stim_dict[stim]['effect'], 
        prediction=is_mutate
    );
    pred_i++;
    pred_i %= sample_size;
    
    document.getElementById('first_sentence').style.display = 'none';
    document.getElementById('sample_before').style.display = 'none';
    document.getElementById('predict_effect').style.display = 'none';
    document.getElementById('pred_button').style.display = 'none';
    
    document.getElementById('last_sentence').style.display = 'inline';
    document.getElementById('sample_after').style.display = 'inline';
    document.getElementById('next_sample').style.display = 'inline';
}

function draw_estimate(c) {
    clear_page();
    document.getElementById("checkbox").setAttribute("disabled",true);
    document.getElementById('next_scenario').style.display = 'none';
    document.getElementById('estimate_input_area').style.display = 'inline-block';
    document.getElementById('next_scenario').setAttribute("disabled", true);
    document.getElementById('continue_scenario').setAttribute("disabled", true);
    document.getElementById('continue_scenario').style.display = 'inline';
    document.getElementById('estimate_slider').value = 50;
    document.getElementById('estimate').innerHTML = 50;
    document.getElementById("checkbox").checked = false;
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

// 因果関係の強さの推定値を取得する
function get_value() {
    let est_i = parseInt(pred_i / EST_INTERVAL, 10);
    append_estimation(
        est_i=est_i,
        estimation=document.getElementById('estimate_slider').value
    );
}

function get_value_fin() {
    document.getElementById('finish_all_scenarios').disabled = true;
    get_value();
    save_estimations();
}

// 推定画面のチェックが入ってるか確認する
function check_estimate() {
    if (document.getElementById('checkbox').checked) {
        document.getElementById('next_scenario').removeAttribute("disabled");
        document.getElementById('continue_scenario').removeAttribute("disabled");
        document.getElementById('finish_all_scenarios').removeAttribute("disabled");

    } else {
        document.getElementById("checkbox").removeAttribute("disabled");
    }
}

// スライダーを触った時のイベントリスナー（機能しない）
// const el = document.getElementById("estimate_slider");
// el.addEventListener("click", check_estimate, false);

// 回答を送信する
function save_estimations() {
    export_results();
}

// ###############
// ## functions ##
// ###############

function  append_estimation(est_i, estimation) {
    let data = {};
    data['user_id'] = user_id;
    data['animal'] = scenarios[sce_idx];
    data['est_i'] = est_i;
    data['estimation'] = estimation;
    estimations.push(data);
}

function  append_prediction(pred_i, stimulation, cause, effect, prediction) {
    let data = {};
    data['user_id'] = user_id;
    data['animal'] = scenarios[sce_idx];
    data['pred_i'] = pred_i;
    data['stimulation'] = stimulation;
    data['cause'] = cause;
    data['effect'] = effect;
    data['prediction'] = prediction;
    predictions.push(data);
}

function export_results() {
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
            'user_data': JSON.stringify(user_data),
            'estimations': JSON.stringify(estimations),
            'predictions': JSON.stringify(predictions),
            'file_name_suffix': 'ls00'
        },
        timeout: 50000
    }).done(function (response) {
        location.href = `../end?id=${user_id}`;
    }).fail(function (jqXHR, textStatus, errorThrown) {
        alert("回答送信中にエラーが発生しました。もう一度終了ボタンを押してください。");
        document.getElementById('finish_all_scenarios').removeAttribute("disabled");
        throw 'Server Error';
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

// ブラウザバックを禁止する関数
function preventBrowserBack() {
    history.pushState(null, null, location.href);
    window.addEventListener('popstate', (e) => {
        history.go(1);
    });
}

// backgroundColorを変更する関数
function changeBackGround(){
	document.body.style.backgroundColor = bgcolors[sce_idx];
}

// backgroundColorをリセットする関数
function resetBackGround(){
    document.body.style.backgroundColor = 'Transparent';
}