import requests
from urllib.request import urlopen
from bs4 import BeautifulSoup
from selenium import webdriver
import MySQLdb
def predict_12_hr():
    url = 'http://opendata.cwb.gov.tw/govdownload?dataid=F-C0032-001&authorizationkey=rdec-key-123-45678-011121314'
    data = []
    r = requests.get(url)
    soup = BeautifulSoup(r.text,"xml")
    for wdata in soup.find_all("location"):
        data.append(wdata.locationName.text)
        for wwdata in wdata.find_all("weatherElement"):
            data.append(wwdata.time.parameter.parameterName.text)
    conn = MySQLdb.connect(host = "localhost", user = "root", passwd = "alex0123", db = "weather")
    conn.set_character_set('utf8')
    for i in range (0,len(data),6):
        r = i//6+1
        conn.cursor().execute('UPDATE 12hr_weather SET city = %s WHERE id = %s',(data[i],r))
        conn.cursor().execute('UPDATE 12hr_weather SET weather = %s WHERE id = %s',(data[i+1],r))
        conn.cursor().execute('UPDATE 12hr_weather SET maxT = %s WHERE id = %s',(data[i+2],r))
        conn.cursor().execute('UPDATE 12hr_weather SET minT = %s WHERE id = %s',(data[i+3],r))
        conn.cursor().execute('UPDATE 12hr_weather SET conf = %s WHERE id = %s',(data[i+4],r))
        conn.cursor().execute('UPDATE 12hr_weather SET pop = %s WHERE id = %s',(data[i+5],r))
        conn.commit()
def predict_24_hr():
    url = 'http://opendata.cwb.gov.tw/govdownload?dataid=F-C0032-001&authorizationkey=rdec-key-123-45678-011121314'
    data = []
    r = requests.get(url)
    soup = BeautifulSoup(r.text,"xml")
    for wdata in soup.find_all("location"):
        data.append(wdata.locationName.text)
        for wwdata in wdata.find_all("weatherElement"):
            wwwdata = wwdata.find_all("time")
            data.append(wwwdata[1].parameter.parameterName.text)
    conn = MySQLdb.connect(host = "localhost", user = "root", passwd = "alex0123", db = "weather")
    conn.set_character_set('utf8')
    for i in range (0,len(data),6):
        r = i//6+1
        conn.cursor().execute('UPDATE 24hr_weather SET city = %s WHERE id = %s',(data[i],r))
        conn.cursor().execute('UPDATE 24hr_weather SET weather = %s WHERE id = %s',(data[i+1],r))
        conn.cursor().execute('UPDATE 24hr_weather SET maxT = %s WHERE id = %s',(data[i+2],r))
        conn.cursor().execute('UPDATE 24hr_weather SET minT = %s WHERE id = %s',(data[i+3],r))
        conn.cursor().execute('UPDATE 24hr_weather SET conf = %s WHERE id = %s',(data[i+4],r))
        conn.cursor().execute('UPDATE 24hr_weather SET pop = %s WHERE id = %s',(data[i+5],r))
        '''conn.cursor().execute("""INSERT INTO 24hr_weather VALUES (%s, %s, %s, %s, %s, %s, %s);""",
                 (r,data[i],data[i+1],data[i+2],data[i+3],data[i+4],data[i+5]))'''
        conn.commit()
def predict_36_hr():
    url = 'http://opendata.cwb.gov.tw/govdownload?dataid=F-C0032-001&authorizationkey=rdec-key-123-45678-011121314'
    data = []
    r = requests.get(url)
    soup = BeautifulSoup(r.text,"xml")
    for wdata in soup.find_all("location"):
        data.append(wdata.locationName.text)
        for wwdata in wdata.find_all("weatherElement"):
            wwwdata = wwdata.find_all("time")
            data.append(wwwdata[2].parameter.parameterName.text)
    conn = MySQLdb.connect(host = "localhost", user = "root", passwd = "alex0123", db = "weather")
    conn.set_character_set('utf8')
    for i in range (0,len(data),6):
        r = i//6+1
        conn.cursor().execute('UPDATE 36hr_weather SET city = %s WHERE id = %s',(data[i],r))
        conn.cursor().execute('UPDATE 36hr_weather SET weather = %s WHERE id = %s',(data[i+1],r))
        conn.cursor().execute('UPDATE 36hr_weather SET maxT = %s WHERE id = %s',(data[i+2],r))
        conn.cursor().execute('UPDATE 36hr_weather SET minT = %s WHERE id = %s',(data[i+3],r))
        conn.cursor().execute('UPDATE 36hr_weather SET conf = %s WHERE id = %s',(data[i+4],r))
        conn.cursor().execute('UPDATE 36hr_weather SET pop = %s WHERE id = %s',(data[i+5],r))
        '''conn.cursor().execute("""INSERT INTO 36hr_weather VALUES (%s, %s, %s, %s, %s, %s, %s);""",(r,data[i],data[i+1],data[i+2],data[i+3],data[i+4],data[i+5]))'''
        conn.commit()
def japan_weather():
    url = 'http://www.data.jma.go.jp/obd/stats/data/mdrr/synopday/data1s.html'
    r = requests.get(url)
    soup = BeautifulSoup(r.text,"html.parser")
    for t in soup.find_all("tr","o1"):
        r = t.text
        r.encode('UTF-8')
        print(r)
if __name__ == '__main__':
    japan_weather()
