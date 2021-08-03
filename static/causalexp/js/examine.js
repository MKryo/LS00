var file = '../static/causalexp/test_sy.json';
var warm_up = '../static/causalexp/demo_data_sy.json';

var test_order = [];
var current_sample_selection = [];
var users_answer = [];

image_type = ["p", "notp", "q", "notq", "u"];
img_combination = new Array();
img_combination = {
    'a': {'before': 'p', 'after': 'q'},
    'b': {'before': 'p', 'after': 'notq'},
    'c': {'before': 'notp', 'after': 'q'},
    'd': {'before': 'notp', 'after': 'notq'},
    'e': {'before': 'p', 'after': 'u'},
    'f': {'before': 'u', 'after': 'q'},
    'g': {'before': 'u', 'after': 'u'},
    'h': {'before': 'u', 'after': 'notq'},
    'i': {'before': 'notp', 'after': 'u'},
}

var flag = 0; // シナリオの初回表示判定に使用
var current_test_order = 0; //何問目か
var current_test_page = 0; // 何事例目か
var sample_num = 0; // 現在の設問の事例の総数
var rand_id = 0;
var start_time = getNow();

// 読み込み時に実行される
// read_json(): jsonファイルを読み込む
// getImages(): 画像のプリロード
// to_next_scenario_description(): シナリオの表示
window.onload = function() {
    warm_up = read_json(warm_up);
    test_order = read_json(file);

    test_order['samples'] = shuffle(test_order['samples']);
    test_order['samples'].unshift(warm_up['samples'][0]);
    users_answer = Array((Object.keys(test_order['samples']).length) * 3);

    getImages();

    document.getElementById('scenario_title').innerHTML = test_order['title'];

    to_next_scenario_description();
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
        img.src = `../${test_order['images'][image_type[type]]}`;
    }

    document.getElementById('preload_image').style.display = "none";
}

// 表示・非表示処理多すぎて見づらかったので一括で処理
// 消えないのあったら適宜追加
function clear_page() {
    document.getElementById('estimate_input_area').style.display = "none";
    document.getElementById('check_sentence').style.display = "none";
    document.getElementById('description_area_first').style.display = "none";
    document.getElementById('description_area').style.display = "none";
    document.getElementById('show_sample_area').style.display = 'none';
}

// シナリオの表示 (初回のみチェックボックス有)
function to_next_scenario_description() {
    clear_page();
    var scenario_description = [];

    if (flag == 1) {
        current_test_order++;

        document.getElementById('same_sentence').style.display = "inline-block";
        document.getElementById('description_area').style.display = "inline-block";
        document.getElementById('scenario_description').style.display = "inline-block";

        for (i in test_order['description']) {
            scenario_description += test_order['description'][i] + "<br>"
        }
        document.getElementById('scenario_description').innerHTML = scenario_description;

        return;
    }

    flag++;

    document.getElementById('check_sentence').style.display = "inline-block";
    document.getElementById('description_area').style.display = "inline-block";
    document.getElementById('description_area_first').style.display = "inline-block";

    document.getElementById('scenario_description1').innerHTML = test_order['description'][0];
    document.getElementById('scenario_description2').innerHTML = test_order['description'][1];
    document.getElementById('scenario_description3').innerHTML = test_order['description'][2];
    document.getElementById('scenario_description4').innerHTML = test_order['description'][3];
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

function mutation_click(btm) {
    if (btm == 1){
        return true;
    }
    else{
        return false;
    }
}

// 事例を表示する画面へ遷移
// 次に表示するテストケースの準備
// start_scenario_buttonから呼び出し
// シャッフルされた事例がnext_sampleに格納される
function to_next_new_sample_page() {
    clear_page();

    var frequency_num = 0;

    sample_num = 0;
    current_test_page = 0;
    current_sample_selection = [];

    document.getElementById('show_sample_area').style.display = "inline";
    document.getElementById('sample_after').style.display = "none";
    document.getElementById('last_sentence').style.display = "none";

    // 現在の設問の事例の総数を取得
    Object.keys(test_order['samples'][current_test_order]['frequency']).forEach(function(elm) {
        if (test_order['samples'][current_test_order]['frequency'][elm] > 0) {
            sample_num += test_order['samples'][current_test_order]['frequency'][elm];
            frequency_num = test_order['samples'][current_test_order]['frequency'][elm];
            for (let i = 0 ; i < frequency_num ; i++) {
                current_sample_selection.push(elm);
            }
        }
    });

    current_sample_selection = shuffle(current_sample_selection);

    to_next_sample();
}

// 次の事例があるか確認し、存在しない場合は推定画面へ遷移
function to_next_sample() {
    if (current_test_page >= sample_num) {
        alert('終了しました。次に、回答をしてください。');
        drow_estimate();
        return;
    }
    // もしmutationのイベントが発火したら、色々表示・非表示を切り替える
    if(mutation_click){
        show_back_sample();
    }

    select_next_sample();
    
}

function select_next_sample() {
    var sample = current_sample_selection[0];
    var desc = test_order['sentences'][sample];
    desc = desc.split('、');

    current_sample_selection.shift(); // 配列の先頭要素を削除

    document.getElementById('sample_before').src = `../${test_order['images'][img_combination[sample]['before']]}`;
    document.getElementById('sample_after').src = `../${test_order['images'][img_combination[sample]['after']]}`;

    document.getElementById('order').innerHTML = '設問' + (current_test_order + 1) + ' - ' + (current_test_page + 1) + '件目'
    document.getElementById('first_sentence').innerHTML = desc[0];
    document.getElementById('last_sentence').innerHTML = desc[1];

    current_test_page++;
}

function show_back_sample() {
    document.getElementById('first_sentence').style.display = 'none';
    document.getElementById('sample_before').style.display = 'none';
    document.getElementById('next_sample').style.display = 'inline';
}

// 推定画面の表示
function drow_estimate() {
    clear_page();
    document.getElementById('estimate_input_area').style.display = 'inline-block';
    document.getElementById('estimate_next_scenario').setAttribute("disabled", true);

    document.getElementById('estimate_gage').value = 50;
    document.getElementById('estimate').innerHTML = 50;
    document.getElementById('checkbox').checked = false;

    document.getElementById('estimate_description').innerHTML = '<p>' + test_order['result'] + 'と思いますか？</p><br>' + 
                                                                '<p>0: 5-HSの投与は遺伝子の変異を起こさない</p><br>' + 
                                                                '<p>100: 5-HSの投与は遺伝子の変異を確実に引き起こす </p><br>' +
                                                                '<p>として、0から100の値で<b>直感的に</b>回答してください。</p><br>'

    if (current_test_order >= Object.keys(test_order['samples']).length - 1) {
        document.getElementById('estimate_next_scenario').innerHTML = '回答を送信して<br>テストを終了する'
        document.getElementById('notes').style.display = "inline-grid";
    }
}

// 推定画面のチェックが入ってるか確認する
// ゲージ操作時にチェックボックスがアクティブ化する処理もまとめてしまったので気になるようなら変更してください
function check_estimate() {
    if (document.getElementById('checkbox').checked) {
        document.getElementById('estimate_next_scenario').removeAttribute("disabled");
    } else {
        document.getElementById('estimate_next_scenario').setAttribute("disabled", true);
    }

    document.getElementById('checkbox').removeAttribute("disabled");
}

// 記録用配列に結果を保存
// 次のテストケースがある場合はシナリオ画面へ遷移
function to_next_test() {
    // 元の並び順で何番目か取得
    var order = test_order['samples'][current_test_order]['no'];

    users_answer[order * 3] = document.getElementById('estimate_gage').value;
    users_answer[order * 3 + 1] = current_test_order;
    users_answer[order * 3 + 2] = getNow();

    if (current_test_order >= Object.keys(test_order['samples']).length - 1) {
        document.getElementById('estimate_next_scenario').setAttribute("disabled", true);
        document.getElementById('estimate_gage').setAttribute("disabled", true);
        document.getElementById('checkbox').setAttribute("disabled", true);
        document.getElementById('estimate_next_scenario').innerHTML = '送信中です...';
        save_users_answer();
    } else {
        to_next_scenario_description();
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