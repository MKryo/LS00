import gspread
import json
import pandas as pd
import gspread_dataframe as gd
from oauth2client.service_account import ServiceAccountCredentials
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from django.http import HttpResponseServerError
from make_html import make_html
from . import gspread_auth


@csrf_exempt
def send(request):
    try:
        raw_data = dict(request.POST)
        data = pd.read_json(raw_data["data"][0])
        sheet_name = raw_data["sheet_name"][0]
        scope = ['https://spreadsheets.google.com/feeds', 'https://www.googleapis.com/auth/drive']
        credentials = ServiceAccountCredentials.from_json_keyfile_name(gspread_auth.jsonkey_path, scope)
        gc = gspread.authorize(credentials)
        worksheet = gc.open_by_url(gspread_auth.gspread_url).worksheet(sheet_name)
        # set_with_dataframe(worksheet, data, include_index=True)
        
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return HttpResponseServerError()
    return HttpResponse(make_html("Succeed!"))



if __name__ == "__main__":
    send({}, True)