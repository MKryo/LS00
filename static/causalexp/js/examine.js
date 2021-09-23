var file = '../static/causalexp/test_sy.json';

var user_data = [];
var test_order = [];
var current_sample_selection = [];
var estimations = [];
var predictions = [];
var sample_order = [];
var mutation_prediction = [];

image_type = ["p", "notp", "q", "notq"];
img_combination = new Array();
img_combination = {
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

var animal = 0;// 動物の判別
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
    to_next_scenario_description(animal);
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
    for(type in image_type){
        var img = document.createElement('img');
        img.src = `../${test_order['mouse']['images'][image_type[type]]}`;
    }
    for(type in image_type){
        var img = document.createElement('img');
        img.src = `../${test_order['rabbit']['images'][image_type[type]]}`;
    }
    for(type in image_type){
        var img = document.createElement('img');
        img.src = `../${test_order['pigeon']['images'][image_type[type]]}`;
    }

    document.getElementById('preload_image').style.display = "none";
}

// 表示・非表示処理多すぎて見づらかったので一括で処理
// 消えないのあったら適宜追加
function clear_page() {
    $("#estimate_input_area").css("display", "none");
    $("#estimate_input_area").css("display", "none");
    document.getElementById('check_sentence_rabbit').style.display = "none";
    document.getElementById('check_sentence_pigeon').style.display = "none";
    document.getElementById('description_area_first').style.display = "none";
    document.getElementById('description_area_first_rabbit').style.display = "none";
    document.getElementById('description_area_first_pigeon').style.display = "none";
    document.getElementById('description_area').style.display = "none";
    document.getElementById('description_area_rabbit').style.display = "none";
    document.getElementById('description_area_pigeon').style.display = "none";
    document.getElementById('show_sample_area').style.display = 'none';
}

// シナリオの表示 (初回のみチェックボックス有)
function to_next_scenario_description(animal) {
    clear_page();
    
    if(animal == 0){
        document.getElementById('scenario_title').innerHTML = test_order['mouse']['title'];
        document.getElementById('check_sentence').style.display = "inline-block";
        document.getElementById('description_area').style.display = "inline-block";
        document.getElementById('description_area_first').style.display = "inline-block";

        var scenario_description = [];

        document.getElementById('scenario_description1').innerHTML = test_order['mouse']['description'][0];
        document.getElementById('scenario_description2').innerHTML = test_order['mouse']['description'][1];
        document.getElementById('scenario_description3').innerHTML = test_order['mouse']['description'][2];
        document.getElementById('scenario_description4').innerHTML = test_order['mouse']['description'][3];
        document.getElementById('start_scenario_button_rabbit').style.display = "none";
        
    } else if(animal == 1){
        $('#scenario_title').html(test_order['rabbit']['title']);
        $("#check_sentence_rabbit").css("display", "inline-block");
        $("#description_area_first_rabbit").css("display", "inline-block");

        var scenario_description = [];

        document.getElementById('description_area_rabbit').style.display = "inline-block";

        for (i in test_order['rabbit']['description']) {
            scenario_description += test_order['rabbit']['description'][i] + "<br>"
        }

        document.getElementById('scenario_description1_rabbit').innerHTML = test_order['rabbit']['description'][0];
        document.getElementById('scenario_description2_rabbit').innerHTML = test_order['rabbit']['description'][1];
        document.getElementById('scenario_description3_rabbit').innerHTML = test_order['rabbit']['description'][2];
        document.getElementById('scenario_description4_rabbit').innerHTML = test_order['rabbit']['description'][3];
        document.getElementById('start_scenario_button').style.display = "none";
        document.getElementById('start_scenario_button_rabbit').style.display = "inline-block";

    } else if(animal == 2){
        var scenario_description = [];
        document.getElementById('scenario_title').innerHTML = test_order['pigeon']['title'];
        document.getElementById('check_sentence_pigeon').style.display = "inline-block";
        document.getElementById('description_area_first_pigeon').style.display = "inline-block";
        document.getElementById('description_area_pigeon').style.display = "inline-block";
        

        for (i in test_order['pigeon']['description']) {
            scenario_description += test_order['pigeon']['description'][i] + "<br>"
        }
        document.getElementById('scenario_description').innerHTML = scenario_description;

        document.getElementById('scenario_description1_pigeon').innerHTML = test_order['pigeon']['description'][0];
        document.getElementById('scenario_description2_pigeon').innerHTML = test_order['pigeon']['description'][1];
        document.getElementById('scenario_description3_pigeon').innerHTML = test_order['pigeon']['description'][2];
        document.getElementById('scenario_description4_pigeon').innerHTML = test_order['pigeon']['description'][3];
        document.getElementById('start_scenario_button_rabbit').style.display = "none";
        document.getElementById('start_scenario_button_pigeon').style.display = "inline-block";
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
    } else {
        document.getElementById('start_scenario_button').setAttribute("disabled", true);
    }
}

// ウサギの事例用
function check_description_rabbit() {
    let checks = document.getElementsByClassName("checks_rabbit");
    let count = 0;
    for (let i = 0 ; i < checks.length ; i++) {
        if (checks[i].checked) count++;
    }
    if (count == checks.length) {
        document.getElementById('start_scenario_button_rabbit').removeAttribute("disabled");
    } else {
        document.getElementById('start_scenario_button_rabbit').setAttribute("disabled", true);
    }
}
// ハトの事例用
function check_description_pigeon() {
    let checks = document.getElementsByClassName("checks_pigeon");
    let count = 0;
    for (let i = 0 ; i < checks.length ; i++) {
        if (checks[i].checked) count++;
    }
    if (count == checks.length) {
        document.getElementById('start_scenario_button_pigeon').removeAttribute("disabled");
    } else {
        document.getElementById('start_scenario_button_pigeon').setAttribute("disabled", true);
    }
}


// 進捗バーを更新する関数
function progress_bar(){
    document.getElementById('progress_bar').value = current_test_page;
    document.getElementById('progress_bar').max = sample_size;
}

// 事例を表示する画面へ遷移
// 次に表示するテストケースの準備
// start_scenario_buttonから呼び出し
// シャッフルされた事例がnext_sampleに格納される
function to_next_new_sample_page(animal) {
    clear_page();
    sample_size = 0;
    current_test_page = 0;
    current_sample_selection = [];

    document.getElementById('show_sample_area').style.display = "inline";
    document.getElementById('sample_after').style.display = "none";
    document.getElementById('last_sentence').style.display = "none";

    if (animal == 0){
        // 現在の設問の事例の総数を取得
        Object.keys(test_order['mouse']['samples'][current_test_order]['frequency']).forEach(function(elm) {
            if (test_order['mouse']['samples'][current_test_order]['frequency'][elm] > 0) {
                sample_size += test_order['mouse']['samples'][current_test_order]['frequency'][elm];
                cell_size = test_order['mouse']['samples'][current_test_order]['frequency'][elm];
                for (let i = 0 ; i < cell_size ; i++) {
                    current_sample_selection.push(elm);
                }
            }
        });

        current_sample_selection = shuffle(current_sample_selection);

        to_next_sample(animal);
    }
    if (animal == 1){
        // 現在の設問の事例の総数を取得
        Object.keys(test_order['rabbit']['samples'][0]['frequency']).forEach(function(elm) {
            if (test_order['rabbit']['samples'][0]['frequency'][elm] > 0) {
                sample_size += test_order['rabbit']['samples'][0]['frequency'][elm];
                cell_size = test_order['rabbit']['samples'][0]['frequency'][elm];
                for (let i = 0 ; i < cell_size ; i++) {
                    current_sample_selection.push(elm);
                }
            }
        });

        current_sample_selection = shuffle(current_sample_selection);

        to_next_sample(animal);
    }
    if (animal == 2){
        // 現在の設問の事例の総数を取得
        Object.keys(test_order['pigeon']['samples'][0]['frequency']).forEach(function(elm) {
            if (test_order['pigeon']['samples'][0]['frequency'][elm] > 0) {
                sample_size += test_order['pigeon']['samples'][0]['frequency'][elm];
                cell_size = test_order['pigeon']['samples'][0]['frequency'][elm];
                for (let i = 0 ; i < cell_size ; i++) {
                    current_sample_selection.push(elm);
                }
            }
        });

        current_sample_selection = shuffle(current_sample_selection);

        to_next_sample(animal);
    }
}

// 次の事例があるか確認し、存在しない場合は推定画面へ遷移
function to_next_sample(animal) {
    if (current_test_page >= sample_size) {
        alert('この動物の実験結果は以上になります。');
        draw_estimate('fin',animal);
        return;
    }
    // 10刺激ごとに因果関係の強さを聞く
    else if(current_test_page % EST_INTERVAL == 0 && current_test_page != 0 && current_test_page != sample_size){
        alert('回答ページへ移ります。');
        i = current_test_page / EST_INTERVAL;
        draw_estimate('mid',animal,i);
        return;
    }
    select_next_sample(animal);
}

function select_next_sample(animal) {
    var sample = current_sample_selection[pred_i];
    if (animal == 0){
        var desc = test_order['mouse']['sentences'][sample];
        desc = desc.split('、');
        
        document.getElementById('estimate_input_area').style.display = 'none';
        document.getElementById('show_sample_area').style.display = "inline";

        document.getElementById('first_sentence').style.display = 'inline';
        document.getElementById('sample_before').style.display = 'inline';
        document.getElementById('select_mutation').style.display = 'inline';
        document.getElementById('Q_select_button').style.display = 'inline';
        document.getElementById('last_sentence').style.display = 'none';
        document.getElementById('sample_after').style.display = 'none';
        document.getElementById('next_sample').style.display = 'none';
        document.getElementById('Ans_select_button').style.display = 'none';
        // 進捗バー更新
        progress_bar();


        document.getElementById('sample_before').src = `../${test_order['mouse']['images'][img_combination[sample]['cause']]}`;
        document.getElementById('sample_after').src = `../${test_order['mouse']['images'][img_combination[sample]['effect']]}`;

        //document.getElementById('order').innerHTML = '設問' + (current_test_order + 1) + ' - ' + (current_test_page + 1) + '件目'
        

        current_test_page++;
    } else if (animal == 1){
        var desc = test_order['rabbit']['sentences'][sample];
        desc = desc.split('、');

        document.getElementById('estimate_input_area').style.display = 'none';
        document.getElementById('show_sample_area').style.display = "inline";

        document.getElementById('first_sentence').style.display = 'inline';
        document.getElementById('sample_before').style.display = 'inline';
        document.getElementById('select_mutation_rabbit').style.display = 'inline';
        document.getElementById('Q_select_button_rabbit').style.display = 'inline';
        document.getElementById('last_sentence').style.display = 'none';
        document.getElementById('sample_after').style.display = 'none';
        document.getElementById('next_sample').style.display = 'none';
        document.getElementById('next_sample_rabbit').style.display = 'none';
        document.getElementById('Ans_select_button').style.display = 'none';
        // 進捗バー更新
        progress_bar();

        document.getElementById('sample_before').src = `../${test_order['rabbit']['images'][img_combination[sample]['cause']]}`;
        document.getElementById('sample_after').src = `../${test_order['rabbit']['images'][img_combination[sample]['effect']]}`;

        //document.getElementById('order').innerHTML = '設問' + (current_test_order + 1) + ' - ' + (current_test_page + 1) + '件目'

        current_test_page++;
    } else if (animal == 2){
        var desc = test_order['pigeon']['sentences'][sample];
        desc = desc.split('、');

        document.getElementById('estimate_input_area').style.display = 'none';
        document.getElementById('show_sample_area').style.display = "inline";

        document.getElementById('first_sentence').style.display = 'inline';
        document.getElementById('sample_before').style.display = 'inline';
        document.getElementById('select_mutation_pigeon').style.display = 'inline';
        document.getElementById('Q_select_button_pigeon').style.display = 'inline';
        document.getElementById('last_sentence').style.display = 'none';
        document.getElementById('sample_after').style.display = 'none';
        document.getElementById('next_sample').style.display = 'none';
        document.getElementById('next_sample_rabbit').style.display = 'none';
        document.getElementById('next_sample_pigeon').style.display = 'none';
        document.getElementById('Ans_select_button').style.display = 'none';
        document.getElementById('Q_select_button').style.display = 'none';
        document.getElementById('select_mutation').style.display = 'none';
        // 進捗バー更新
        progress_bar();

        document.getElementById('sample_before').src = `../${test_order['pigeon']['images'][img_combination[sample]['cause']]}`;
        document.getElementById('sample_after').src = `../${test_order['pigeon']['images'][img_combination[sample]['effect']]}`;

        //document.getElementById('order').innerHTML = '設問' + (current_test_order + 1) + ' - ' + (current_test_page + 1) + '件目'
        current_test_page++;
    }
    document.getElementById('first_sentence').innerHTML = desc[0];
    document.getElementById('last_sentence').innerHTML = desc[1];
}



function show_back_sample(animal,isMutate) {
    let stim = current_sample_selection[pred_i];

    append_prediction(
        animal=animal,
        pred_i=pred_i,
        stimulation=stim,
        cause=stim_dict[stim]['cause'],
        effect=stim_dict[stim]['effect'], 
        prediction=isMutate
    );
    pred_i++;
    pred_i %= sample_size;
    
    document.getElementById('first_sentence').style.display = 'none';
    document.getElementById('sample_before').style.display = 'none';
    
    
    document.getElementById('Ans_select_button').style.display = 'inline';
    document.getElementById('last_sentence').style.display = 'inline';
    document.getElementById('sample_after').style.display = 'inline';
    if(animal==0){
        document.getElementById('select_mutation').style.display = 'none';
        document.getElementById('Q_select_button').style.display = 'none';
        document.getElementById('next_sample').style.display = 'inline';
    }
    if(animal==1){
        document.getElementById('select_mutation_rabbit').style.display = 'none';
        document.getElementById('Q_select_button_rabbit').style.display = 'none';
        document.getElementById('next_sample_rabbit').style.display = 'inline';
    }
    if(animal==2){
        document.getElementById('select_mutation_pigeon').style.display = 'none';
        document.getElementById('Q_select_button_pigeon').style.display = 'none';
        document.getElementById('next_sample_pigeon').style.display = 'inline';
    }
}



function draw_estimate(c, animal,i) {
    clear_page();
    document.getElementById('checkbox').setAttribute("disabled",true);

    if(animal==0){
        document.getElementById('estimate_input_area').style.display = 'inline-block';
        document.getElementById('estimate_next_scenario').setAttribute("disabled", true);

        document.getElementById('estimate_gage').value = 50;
        document.getElementById('estimate').innerHTML = 50;
        document.getElementById('checkbox').checked = false;

        if (c=='fin'){
            document.getElementById('continue_scenario').style.display = 'none';
            document.getElementById('estimate_next_scenario').style.display = 'inline';
        }

        document.getElementById('estimate_description').innerHTML = '<p>' + test_order['mouse']['result'] + 'と思いますか？</p><br>' + 
                                                                '<p>0: 5-HSという化学物質の投与はマウスの遺伝子の変異を全く引き起こさない</p><br>' + 
                                                                '<p>100: 5-HSという化学物質の投与はマウスの遺伝子の変異を確実に引き起こす </p><br>' +
                                                                '<p>として、0から100の値で<b>直感的に</b>回答してください。</p><br>'   
    }
    if(animal==1){
        document.getElementById('estimate_next_scenario').style.display = 'none';
        document.getElementById('estimate_input_area').style.display = 'inline-block';
        document.getElementById('estimate_next_scenario_rabbit').setAttribute("disabled", true);
    
        document.getElementById('estimate_gage').value = 50;
        document.getElementById('estimate').innerHTML = 50;
        document.getElementById('checkbox').checked = false;
        document.getElementById('continue_scenario_rabbit').style.display = 'inline';
    
        if (c=='fin'){
            document.getElementById('continue_scenario_rabbit').style.display = 'none';
            document.getElementById('estimate_next_scenario_rabbit').style.display = 'inline';
        }
    
        document.getElementById('estimate_description').innerHTML = '<p>' + test_order['rabbit']['result'] + 'と思いますか？</p><br>' + 
                                                                    '<p>0: 5-HSという化学物質の投与はウサギの遺伝子の変異を全く引き起こさない</p><br>' + 
                                                                    '<p>100: 5-HSという化学物質の投与はウサギの遺伝子の変異を確実に引き起こす </p><br>' +
                                                                    '<p>として、0から100の値で<b>直感的に</b>回答してください。</p><br>'
    }
    if(animal==2){
        document.getElementById('estimate_input_area').style.display = 'inline-block';
        document.getElementById('estimate_next_scenario_pigeon').setAttribute("disabled", true);
    
        document.getElementById('estimate_gage').value = 50;
        document.getElementById('estimate').innerHTML = 50;
        document.getElementById('checkbox').checked = false;
        document.getElementById('continue_scenario_pigeon').style.display = 'inline';
        document.getElementById('estimate_next_scenario_rabbit').style.display = 'none';
    
        if (c=='fin'){
            document.getElementById('continue_scenario_pigeon').style.display = 'none';
            document.getElementById('estimate_next_scenario_rabbit').style.display = 'none';
            document.getElementById('estimate_next_scenario_pigeon').style.display = 'inline';
            
        }
    
        document.getElementById('estimate_description').innerHTML = '<p>' + test_order['pigeon']['result'] + 'と思いますか？</p><br>' + 
                                                                    '<p>0: 5-HSという化学物質の投与はハトの遺伝子の変異を全く引き起こさない</p><br>' + 
                                                                    '<p>100: 5-HSという化学物質の投与はハトの遺伝子の変異を確実に引き起こす </p><br>' +
                                                                    '<p>として、0から100の値で<b>直感的に</b>回答してください。</p><br>'       
    }
}

function get_value(animal) {

    let est_i = parseInt(pred_i / EST_INTERVAL, 10);
    
    append_estimation(
        animal=animal,
        est_i=est_i,
        estimation=document.getElementById('estimate_gage').value
    );
}
function get_value_fin(animal) {
    get_value(animal);
    save_estimations();
}

// 推定画面のチェックが入ってるか確認する
// ゲージ操作時にチェックボックスがアクティブ化する処理もまとめてしまったので気になるようなら変更してください
function check_estimate() {
    
    if (document.getElementById('checkbox').checked) {
        document.getElementById('estimate_next_scenario').removeAttribute("disabled");
        document.getElementById('continue_scenario').removeAttribute("disabled");
        document.getElementById('estimate_next_scenario_rabbit').removeAttribute("disabled");
        document.getElementById('continue_scenario_rabbit').removeAttribute("disabled");
        document.getElementById('estimate_next_scenario_pigeon').removeAttribute("disabled");
        document.getElementById('continue_scenario_pigeon').removeAttribute("disabled");
    } else {
        document.getElementById('estimate_next_scenario').setAttribute("disabled", true);
        document.getElementById('continue_scenario').setAttribute("disabled", true);
        document.getElementById('estimate_next_scenario_rabbit').setAttribute("disabled", true);
        document.getElementById('continue_scenario_rabbit').setAttribute("disabled", true);
        document.getElementById('estimate_next_scenario_pigeon').setAttribute("disabled", true);
        document.getElementById('continue_scenario_pigeon').setAttribute("disabled", true);
    }
    document.getElementById('checkbox').removeAttribute("disabled");
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

function  append_estimation(animal, est_i, estimation) {
    let data = {};
    data['user_id'] = user_id;
    data['animal'] = animal;
    data['est_i'] = est_i;
    data['estimation'] = estimation;
    estimations.push(data);
}

function  append_prediction(animal, pred_i, stimulation, cause, effect, prediction) {
    let data = {};
    data['user_id'] = user_id;
    data['animal'] = animal;
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
            'sheet_name': 'user_info'
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
            'sheet_name': 'estimations'
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
            'sheet_name': 'predictions'
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
const shuffle = ([...array]) => {
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
	var mon = now.getMonth()+1;
	var day = now.getDate();
	var hour = now.getHours();
	var min = now.getMinutes();
	var sec = now.getSeconds();
	var s = year + "/" + mon + "/" + day + " " + hour + ":" + min + ":" + sec; 
	return s;
}