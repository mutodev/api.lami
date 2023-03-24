connect-dev:
	sudo ssh -i "ssh/lami.pem" ubuntu@52.33.82.104

update-api:
	ssh -i "ssh/Ubuntu-LAMI.pem" ubuntu@52.3.32.125 -y "cd /opt/api.lami ; sudo pkill node ; sudo git pull ; sudo yarn mg ; sudo sh -x /etc/init.d/lamiService start ; tail -f /var/log/lamiservice.log"

install:
	ssh -i "ssh/Ubuntu-LAMI.pem" ubuntu@52.3.32.125 -y "cd /opt/api.lami ; sudo pkill node ; sudo git pull ; sudo yarn install ; sudo sh -x /etc/init.d/lamiService start ; tail -f /var/log/lamiservice.log"

update-web:
	ssh -i "ssh/Ubuntu-LAMI.pem" ubuntu@52.3.32.125 -y "cd /opt/web.lami ; sudo git pull ; sudo yarn build"

# sudo sh -x /etc/init.d/lamiService start
# sudo sh -x /etc/init.d/weblamiService start
# tail -f /var/log/lamiservice.log
# tail -f /var/log/weblamiservice.log
# pm2 start dist/apps/integration-sap/main.js --watch
# pm2 start dist/apps/api.lami/main.js --watch
# pm2 stop dist/apps/integration-sap/main.js
# pm2 stop dist/apps/api.lami/main.js
