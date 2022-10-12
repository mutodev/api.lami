connect-dev:
	ssh -i "ssh/Ubuntu-LAMI3.pem" ubuntu@52.3.32.125

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