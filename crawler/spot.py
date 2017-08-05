import requests
import MySQLdb
from urllib.request import urlopen
from bs4 import BeautifulSoup
from selenium import webdriver
def get_spot():
    url = 'https://www.tripadvisor.com.tw/Attractions-g298184-Activities-Tokyo_Tokyo_Prefecture_Kanto.html'
    driver = webdriver.PhantomJS(executable_path="/usr/bin/phantomjs")  
    driver.get(url)   
    soup = BeautifulSoup(driver.page_source, "html.parser")
    conn = MySQLdb.connect(host = "localhost", user = "root", passwd = "alex0123", db = "weather")
    conn.set_character_set('utf8')
    for d in soup.find_all("div","item name"):
        new_url = 'https://www.tripadvisor.com.tw' + (d.a['href'])
        ddriver = webdriver.PhantomJS(executable_path="/usr/bin/phantomjs")  
        ddriver.get(new_url)
        ssoup = BeautifulSoup(ddriver.page_source, "html.parser")
        for dd in ssoup.find_all("div","entry"):
           string = dd.text
           for i in range (0,len(dd.text)):
               if string[i] == '夜':
                   conn.cursor().execute('insert into tokyo_night values (%s,%s);',(d.text,string))
                   conn.commit()
if __name__ == '__main__':
    get_spot()
