import json
import os
import csv
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from django.http import HttpResponseServerError

@csrf_exempt
def send(request):

    try:
        raw_data = dict(request.POST)
        data = json.loads(raw_data["data"][0])
        sheet_name = raw_data["sheet_name"][0]
        filepath = os.path.join('.', 'res_' + sheet_name + '.csv')

        # res.csvが存在しないとき，作成し，ヘッダーを書き込む
        if not os.path.exists(filepath):
            with open(filepath, 'w', newline='') as f:
                writer = csv.DictWriter(f, data[0].keys())
                writer.writeheader()

        with open(filepath, 'a', newline='') as f:
            writer = csv.DictWriter(f, data[0].keys())
            writer.writerows(data)

    except Exception as e:
        import traceback
        traceback.print_exc()
        return HttpResponseServerError()
    return HttpResponse(status=200)

if __name__ == "__main__":
    send({}, True)