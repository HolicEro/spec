import urllib2
import re
import time
import xlwt

from bs4 import BeautifulSoup

#base url

baseUrl = 'http://www.ctoutiao.com/cmap.php?act=startups&id=24&qStr=area|311'

# get index range and information number from the base url
response = None

while(not response):
	try:
		response = urllib2.urlopen(baseUrl)
	finally:
		pass

soup = BeautifulSoup(response.read(),"html.parser")

itemNumber = soup.find('h1', class_='T_reght').span.text.strip()

rawTotalPage = soup.find('div', class_='Tapage').em.text.strip()

totalPage = rawTotalPage[2:-1]

print 'find ' + itemNumber + ' infomation to spec...'

print 'there are ' + totalPage + ' pages to read...'

totalPage = int(totalPage)


# open the excel file to write the data

wbk = xlwt.Workbook()

sheet = wbk.add_sheet('sheet 1')

# start the outter loop

print 'start collecting information ...'

print '--------------------------------'

itemNumber = 0

for pageNumber in xrange(1, totalPage + 1):


	if (not pageNumber%20):
		print 'sleep for 20s'
		time.sleep(10)
	else:
		time.sleep(5)

	print 'Now at page ' + str(pageNumber) + ', out of ' + str(totalPage)

	print 'time: ' + time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))

	outterUrl = baseUrl + '&p=' + str(pageNumber)

	response = None

	while(not response):

		try:
			print 'retry fetch page ' + str(pageNumber)

			response = urllib2.urlopen(outterUrl)
			
			if (response):
				print 'succeed to fetch response'
			else:
				print 'fail to fetch response'

		finally:
			soup = BeautifulSoup(response.read(),"html.parser")

	itemList = []
	

	for item in soup.find_all('div', class_="T_dlfs"):
		try:
			companyName = item.dl.dd.h1.text.strip()
			companyAddress = item.dl.span.text.strip()


			

			itemNumber += 1

			sheet.write(itemNumber, 0, itemNumber)
			sheet.write(itemNumber, 1, companyName)
			sheet.write(itemNumber, 2, companyAddress)

		finally:
			wbk.save('companyInfo.xls')


print 'job done'