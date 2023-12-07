

# การใช้งาน automate cicd ของ DeepOcean.Fund platform

#### Prerequisites:
	1. github account (under Deep-Ocean-Fund org.), jira account
	2. git tools (gitbash download->https://git-scm.com/downloads, sourcetree download->https://www.sourcetreeapp.com หรือ tool อื่นๆ)
	3. gcp account (under DeepOcean.fund org.)
		role: Project Editor
	4. postman download-> https://www.postman.com/downloads (หรือ tool อื่นๆ ที่ใช้ test web/rest api)
	5. vs code download->https://code.visualstudio.com/download
	6. terraform configuration (ฮู๊ดทำให้)
	7. git clone repo ตาม project ที่ต้องการ implement
		git clone -b development <repo>
	8. switch branch ไปที่ development (branch strategy)
	9. ก่อนจะ implement new feature ให้แตก branch feature_[feature name] จาก branch development ก่อน เช่น
		git checkout -b feature_payment
		git push --set-upstream origin feature_payment
	10. หลังจาก dev. feature เสร็จแล้ว ให้ merge เข้า branch development เท่านั้น
		การ test feature branch จะ test บนเครื่องตัวเองเป็นหลัก เพราะ cloud build จะ config ให้ automate cicd เฉพาะ development
[========]

##### ขั้นตอนการ deploy resource ขึ้น gcp ของ DeepOcean.fund platform
	1. push code ขึ้น github ใน branch **development** เท่านั้น
	2. เข้าไปดูผลการ build & deploy บน gcp ใน service **Cloud Build -> History** ex. https://console.cloud.google.com/cloud-build/builds;region=global/d5bb297c-9021-436f-a77b-0316ae3dcb63?project=prj-bu1-d-tradingbot-f7a1


[========]
## Customer Website
#### สำหรับ developer ที่ implement frontend มีขั้นตอนตามนี้
##### การ test & deploy บนเครื่องตัวเอง
	1. หลังจากเตรียม env. ตามหัวข้อ Prerequisites แล้ว ขั้นตอนต่อไปให้ติดตั้ง tools ต่อไปนี้
		- nodejs & npm https://nodejs.org/en/
		- หลังจากติดตั้ง nodejs และ npm เสร็จแล้ว ให้ติดตั้ง yarn ด้วยคำสั่ง https://yarnpkg.com/
			npm install yarn
		- python 3.9 https://www.python.org/
	2. clone repo do-website 
		git clone https://github.com/Deep-Ocean-Fund/do-website.git
		cd เข้าไปที่ do-website 
			cd do-website
		พิมพ์คำสั่ง 
			yarn install
		หลังจากคำสั่งข้างบนเสร็จแล้ว พิมพ์คำสั่ง 
			yarn start
	3. รอ browser เปิดเข้าหน้าแรกของ DeepOcean.Fund

##### การ test & deploy บน gcp
1. push code ขึ้น github
2. เปิด URL ตามข้อมูลในตาราง

| Environment  | URL  |
| ------------ | ------------ |
| development  | https://pub-deepocean-dev.web.app  |
| non-production  | https://pub-deepocean-nprod.web.app  |






