var file = '../static/causalexp/test_sy.json';

var test_order = [];
var current_sample_selection = [];
var users_answer = [];

image_type = ["p", "notp", "q", "notq"];
img_combination = new Array();
img_combination = {
    'a': {'before': 'p', 'after': 'q'},
    'b': {'before': 'p', 'after': 'notq'},
    'c': {'before': 'notp', 'after': 'q'},
    'd': {'before': 'notp', 'after': 'notq'}
}

var flag = 0; // シナリオの初回表示判定に使用
var current_test_order = 0;
var current_test_page = 0; // 何事例目か
var sample_num = 0; // 現在の設問の事例の総数
var rand_id = 0;
var start_time = getNow();

var animal = 0;// 動物の判別

// 読み込み時に実行される
// read_json(): jsonファイルを読み込む
// getImages(): 画像のプリロード
// to_next_scenario_description(): シナリオの表示
window.onload = function() {
    test_order = read_json(file);

    users_answer = Array((Object.keys(test_order['mouse']['samples']).length) * 3);
    //users_answer = Array((Object.keys(test_order['rabit']['samples']).length) * 3);
    //users_answer = Array((Object.keys(test_order['pigeon']['samples']).length) * 3);

    getImages();

    document.getElementById('scenario_title').innerHTML = test_order['mouse']['title'];
    //document.getElementById('scenario_title_m').innerHTML = test_order['mouse']['title'];
    //document.getElementById('scenario_title_r').innerHTML = test_order['rabit']['title'];
    //document.getElementById('scenario_title_p').innerHTML = test_order['pigeon']['title'];

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
        img.src = `../${test_order['rabit']['images'][image_type[type]]}`;
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
    document.getElementById('estimate_input_area').style.display = "none";
    document.getElementById('check_sentence').style.display = "none";
    document.getElementById('check_sentence_rabit').style.display = "none";
    document.getElementById('description_area_first').style.display = "none";
    document.getElementById('description_area_first_rabit').style.display = "none";
    document.getElementById('description_area').style.display = "none";
    document.getElementById('description_area_rabit').style.display = "none";
    document.getElementById('show_sample_area').style.display = 'none';

}

// シナリオの表示 (初回のみチェックボックス有)
function to_next_scenario_description(animal) {
    clear_page();
    

    if(animal == 0){
        document.getElementById('check_sentence').style.display = "inline-block";
        document.getElementById('description_area').style.display = "inline-block";
        document.getElementById('description_area_first').style.display = "inline-block";

        var scenario_description = [];

        document.getElementById('scenario_description1').innerHTML = test_order['mouse']['description'][0];
        document.getElementById('scenario_description2').innerHTML = test_order['mouse']['description'][1];
        document.getElementById('scenario_description3').innerHTML = test_order['mouse']['description'][2];
        document.getElementById('scenario_description4').innerHTML = test_order['mouse']['description'][3];
        document.getElementById('start_scenario_button_rabit').style.display = "none";
        
    }

    if(animal == 1){
        document.getElementById('check_sentence_rabit').style.display = "inline-block";
        document.getElementById('description_area_first_rabit').style.display = "inline-block";

        var scenario_description = [];

        //document.getElementById('same_sentence_rabit').style.display = "inline-block";
        document.getElementById('description_area_rabit').style.display = "inline-block";

            for (i in test_order['rabit']['description']) {
                scenario_description += test_order['rabit']['description'][i] + "<br>"
                }
        //document.getElementById('scenario_description_rabit').innerHTML = scenario_description;

        document.getElementById('scenario_description1_rabit').innerHTML = test_order['rabit']['description'][0];
        document.getElementById('scenario_description2_rabit').innerHTML = test_order['rabit']['description'][1];
        document.getElementById('scenario_description3_rabit').innerHTML = test_order['rabit']['description'][2];
        document.getElementById('scenario_description4_rabit').innerHTML = test_order['rabit']['description'][3];
        document.getElementById('start_scenario_button').style.display = "none";
        document.getElementById('start_scenario_button_rabit').style.display = "inline-block";

        }


        if(animal == 2){
            var scenario_description = [];

            document.getElementById('same_sentence').style.display = "inline-block";
            document.getElementById('description_area').style.display = "inline-block";
            document.getElementById('scenario_description').style.display = "inline-block";

            for (i in test_order['pigeon']['description']) {
                scenario_description += test_order['pigeon']['description'][i] + "<br>"
            }
            document.getElementById('scenario_description').innerHTML = scenario_description;

            document.getElementById('scenario_description1').innerHTML = test_order['pigeon']['description'][0];
            document.getElementById('scenario_description2').innerHTML = test_order['pigeon']['description'][1];
            document.getElementById('scenario_description3').innerHTML = test_order['pigeon']['description'][2];
            document.getElementById('scenario_description4').innerHTML = test_order['pigeon']['description'][3];
            document.getElementById('start_scenario_button').style.display = "none";
            document.getElementById('start_scenario_button_rabit').style.display = "none";
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
function check_description_rabit() {
    let checks = document.getElementsByClassName("checks_rabit");
    let count = 0;
    for (let i = 0 ; i < checks.length ; i++) {
        if (checks[i].checked) count++;
    }
    if (count == checks.length) {
        document.getElementById('start_scenario_button_rabit').removeAttribute("disabled");
    } else {
        document.getElementById('start_scenario_button_rabit').setAttribute("disabled", true);
    }
}
// ハトの事例用
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


// 進捗バーを更新する関数
function progress_bar(){
    document.getElementById('progress_bar').value = current_test_page;
    document.getElementById('progress_bar').max = sample_num;
}


// 事例を表示する画面へ遷移
// 次に表示するテストケースの準備
// start_scenario_buttonから呼び出し
// シャッフルされた事例がnext_sampleに格納される
function to_next_new_sample_page(animal) {
    clear_page();

    var frequency_num = 0;
    sample_num = 0;
    current_test_page = 0;
    current_sample_selection = [];

    document.getElementById('show_sample_area').style.display = "inline";
    document.getElementById('sample_after').style.display = "none";
    document.getElementById('last_sentence').style.display = "none";

    if (animal == 0){
        // 現在の設問の事例の総数を取得
        Object.keys(test_order['mouse']['samples'][current_test_order]['frequency']).forEach(function(elm) {
            if (test_order['mouse']['samples'][current_test_order]['frequency'][elm] > 0) {
                sample_num += test_order['mouse']['samples'][current_test_order]['frequency'][elm];
                frequency_num = test_order['mouse']['samples'][current_test_order]['frequency'][elm];
                for (let i = 0 ; i < frequency_num ; i++) {
                    current_sample_selection.push(elm);
                }
            }
        });

        current_sample_selection = shuffle(current_sample_selection);

        to_next_sample(animal);
    }
    if (animal == 1){
        alert(animal);
        // 現在の設問の事例の総数を取得
        Object.keys(test_order['rabit']['samples'][0]['frequency']).forEach(function(elm) {
            if (test_order['rabit']['samples'][0]['frequency'][elm] > 0) {
                sample_num += test_order['rabit']['samples'][0]['frequency'][elm];
                frequency_num = test_order['rabit']['samples'][0]['frequency'][elm];
                for (let i = 0 ; i < frequency_num ; i++) {
                    current_sample_selection.push(elm);
                }
            }
        });

        current_sample_selection = shuffle(current_sample_selection);

        to_next_sample(animal);
    }
    if (animal == 2){
        // 現在の設問の事例の総数を取得
        Object.keys(test_order['pigeon']['samples'][current_test_order]['frequency']).forEach(function(elm) {
            if (test_order['pigeon']['samples'][current_test_order]['frequency'][elm] > 0) {
                sample_num += test_order['pigeon']['samples'][current_test_order]['frequency'][elm];
                frequency_num = test_order['pigeon']['samples'][current_test_order]['frequency'][elm];
                for (let i = 0 ; i < frequency_num ; i++) {
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
    if (current_test_page >= sample_num) {
        alert('終了しました。次に、回答をしてください。');
        draw_estimate('fin');
        return;
    }
    // 10刺激ごとに因果関係の強さを聞く
    else if(current_test_page % 10 == 0 && current_test_page != 0 && current_test_page != sample_num){
        alert('ここで回答ページへ移ります');
        draw_estimate('mid');
        return;
    }
    select_next_sample(animal);
}

function select_next_sample(animal) {
    if (animal == 0){
        var sample = current_sample_selection[0];
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

        current_sample_selection.shift(); // 配列の先頭要素を削除

        document.getElementById('sample_before').src = `../${test_order['mouse']['images'][img_combination[sample]['before']]}`;
        document.getElementById('sample_after').src = `../${test_order['mouse']['images'][img_combination[sample]['after']]}`;

        //document.getElementById('order').innerHTML = '設問' + (current_test_order + 1) + ' - ' + (current_test_page + 1) + '件目'
        document.getElementById('first_sentence').innerHTML = desc[0];
        document.getElementById('last_sentence').innerHTML = desc[1];

        current_test_page++;
    }
    if (animal == 1){
        var sample = current_sample_selection[0];
        var desc = test_order['rabit']['sentences'][sample];
        desc = desc.split('、');

        document.getElementById('estimate_input_area').style.display = 'none';
        document.getElementById('show_sample_area').style.display = "inline";

        document.getElementById('first_sentence').style.display = 'inline';
        document.getElementById('sample_before').style.display = 'inline';
        document.getElementById('select_mutation_rabit').style.display = 'inline';
        document.getElementById('Q_select_button_rabit').style.display = 'inline';
        document.getElementById('last_sentence').style.display = 'none';
        document.getElementById('sample_after').style.display = 'none';
        document.getElementById('next_sample').style.display = 'none';
        document.getElementById('next_sample_rabit').style.display = 'none';
        document.getElementById('Ans_select_button').style.display = 'none';
        // 進捗バー更新
        progress_bar();

        current_sample_selection.shift(); // 配列の先頭要素を削除

        document.getElementById('sample_before').src = `../${test_order['rabit']['images'][img_combination[sample]['before']]}`;
        document.getElementById('sample_after').src = `../${test_order['rabit']['images'][img_combination[sample]['after']]}`;

        //document.getElementById('order').innerHTML = '設問' + (current_test_order + 1) + ' - ' + (current_test_page + 1) + '件目'
        document.getElementById('first_sentence').innerHTML = desc[0];
        document.getElementById('last_sentence').innerHTML = desc[1];

        current_test_page++;
    }

    if (animal == 2){
        var sample = current_sample_selection[0];
        var desc = test_order['pigeon']['sentences'][sample];
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

        current_sample_selection.shift(); // 配列の先頭要素を削除

        document.getElementById('sample_before').src = `../${test_order['pigeon']['images'][img_combination[sample]['before']]}`;
        document.getElementById('sample_after').src = `../${test_order['pigeon']['images'][img_combination[sample]['after']]}`;

        //document.getElementById('order').innerHTML = '設問' + (current_test_order + 1) + ' - ' + (current_test_page + 1) + '件目'
        document.getElementById('first_sentence').innerHTML = desc[0];
        document.getElementById('last_sentence').innerHTML = desc[1];

        current_test_page++;
    }
}


function show_back_sample(animal) {
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
        document.getElementById('select_mutation_rabit').style.display = 'none';
        document.getElementById('Q_select_button_rabit').style.display = 'none';
        document.getElementById('next_sample_rabit').style.display = 'inline';
    }
    if(animal==2){
        //document.getElementById('select_mutation').style.display = 'none';
        document.getElementById('next_sample_pigeon').style.display = 'inline';
    }

}
function draw_estimate(c) {
    clear_page();

    document.getElementById('estimate_input_area').style.display = 'inline-block';
    document.getElementById('estimate_next_scenario').setAttribute("disabled", true);
    //document.getElementsByID('estimate_next_scenario').style.display = 'none';

    document.getElementById('estimate_gage').value = 50;
    document.getElementById('estimate').innerHTML = 50;
    document.getElementById('checkbox').checked = false;

    if (c=='fin'){
        document.getElementById('continue_scenario').style.display = 'none';
        document.getElementById('estimate_next_scenario').style.display = 'inline';
        //if (current_test_order >= Object.keys(test_order['mouse']['samples']).length - 1) {
            //document.getElementById('estimate_next_scenario').innerHTML = '回答を送信して<br>次の実験記録へ進む'
            //document.getElementById('notes').style.display = "inline-grid";
        //}
    }

    document.getElementById('estimate_description').innerHTML = '<p>' + test_order['mouse']['result'] + 'と思いますか？</p><br>' + 
                                                                '<p>0: 5-HSという化学物質の投与はマウスの遺伝子の変異を全く引き起こさない</p><br>' + 
                                                                '<p>100: 5-HSという化学物質の投与はマウスの遺伝子の変異を確実に引き起こす </p><br>' +
                                                                '<p>として、0から100の値で<b>直感的に</b>回答してください。</p><br>'   
}

// 推定画面のチェックが入ってるか確認する
// ゲージ操作時にチェックボックスがアクティブ化する処理もまとめてしまったので気になるようなら変更してください
function check_estimate() {
    if (document.getElementById('checkbox').checked) {
        document.getElementById('estimate_next_scenario').removeAttribute("disabled");
        document.getElementById('continue_scenario').removeAttribute("disabled");
    } else {
        document.getElementById('estimate_next_scenario').setAttribute("disabled", true);
        document.getElementById('continue_scenario').setAttribute("disabled", true);
    }

    document.getElementById('checkbox').removeAttribute("disabled");
}

// 記録用配列に結果を保存
// 次のテストケースがある場合はシナリオ画面へ遷移
function to_next_test(animal) {
    clear_page();

    if (animal == 0){
        document.getElementById('show_sample_area').style.display = "inline";
        document.getElementById('Q_select_button').style.display = "inline";
        document.getElementById('sample_after').style.display = "none";
        document.getElementById('last_sentence').style.display = "none";
        // 元の並び順で何番目か取得
        var order = test_order['mouse']['samples'][current_test_order]['no'];

        users_answer[order * 3] = document.getElementById('estimate_gage').value;
        users_answer[order * 3 + 1] = current_test_order;
        users_answer[order * 3 + 2] = getNow();

        if (current_test_order >= Object.keys(test_order['mouse']['samples']).length - 1) {
            document.getElementById('estimate_next_scenario').setAttribute("disabled", true);
            document.getElementById('estimate_gage').setAttribute("disabled", true);
            document.getElementById('checkbox').setAttribute("disabled", true);
            //document.getElementById('estimate_next_scenario').innerHTML = '送信中です...';
            //save_users_answer();
        } else {
            to_next_scenario_description(animal);
        }
    }

    if (animal == 1){
        document.getElementById('show_sample_area').style.display = "inline";
        document.getElementById('Q_select_button').style.display = "inline";
        document.getElementById('sample_after').style.display = "none";
        document.getElementById('last_sentence').style.display = "none";
        // 元の並び順で何番目か取得
        var order = test_order['rabit']['samples'][current_test_order]['no'];

        users_answer[order * 3] = document.getElementById('estimate_gage').value;
        users_answer[order * 3 + 1] = current_test_order;
        users_answer[order * 3 + 2] = getNow();

        if (current_test_order >= Object.keys(test_order['rabit']['samples']).length - 1) {
            document.getElementById('estimate_next_scenario').setAttribute("disabled", true);
            document.getElementById('estimate_gage').setAttribute("disabled", true);
            document.getElementById('checkbox').setAttribute("disabled", true);
            //document.getElementById('estimate_next_scenario').innerHTML = '送信中です...';
            //save_users_answer();
        } else {
            to_next_scenario_description(animal);
        }
    }

    if (animal == 2){
        document.getElementById('show_sample_area').style.display = "inline";
        document.getElementById('Q_select_button').style.display = "inline";
        document.getElementById('sample_after').style.display = "none";
        document.getElementById('last_sentence').style.display = "none";
        // 元の並び順で何番目か取得
        var order = test_order['pigeon']['samples'][current_test_order]['no'];

        users_answer[order * 3] = document.getElementById('estimate_gage').value;
        users_answer[order * 3 + 1] = current_test_order;
        users_answer[order * 3 + 2] = getNow();

        if (current_test_order >= Object.keys(test_order['pigeon']['samples']).length - 1) {
            document.getElementById('estimate_next_scenario').setAttribute("disabled", true);
            document.getElementById('estimate_gage').setAttribute("disabled", true);
            document.getElementById('checkbox').setAttribute("disabled", true);
            //document.getElementById('estimate_next_scenario').innerHTML = '送信中です...';

            //save_users_answer();
        } else {
            to_next_scenario_description(animal);
        }
    }
    
}

// 回答をスプレッドシートに送信する
function save_users_answer() {
    // ランダム数列の発行
    rand_id = Math.round(Math.random() * 100000000);
    rand_id = zeroPadding(rand_id, 8);
    users_answer.unshift(rand_id);
    users_answer.push(start_time);
    users_answer.push(getNow());
    users_answer.push(window.navigator.userAgent);

    $.ajax({
        type: 'POST',
        url: '../sendtoGS/',
        data: {'data': users_answer},
        dataType: 'text',
    })
        .then(
            function() { // 成功時
                location.href = `../end?id=${rand_id}`;
            },
            function () { // 失敗時
                alert('回答送信プロセスでエラーが発生しました。このページのまま少し時間を置いて再度お試しいただくか、問い合わせしていただきますようお願いします。');
                document.getElementById('estimate_next_scenario').removeAttribute("disabled");
            });
}

// ###############
// ## functions ##
// ###############

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