
# install cairo if using node canvas
sudo yum install cairo-devel libjpeg-turbo-devel giflib-devel -y


--- LINUX EC2 SETUP ---


# 1. make sure ports 80, 8080 and 22 are open on the ec2's security group
# 2. set host and protocol in tools/config folder
# 3. get your pem key and place in tools/keys folder
# 4. learn vim -> http://linuxconfig.org/vim-tutorial
# 5. follow instructions below


# go to tools/bin folder in terminal
cd /path/to/tools/bin/


# connect to ec2 instance:
./connect


# update the ec2 instance:
sudo yum update


# enable port forwarding:
# (find net.ipv4.ip_forward = 0 and change to net.ipv4.ip_forward = 1)
# "a" to append text
# "esc" then ":wq!" to save and exit
sudo vim /etc/sysctl.conf


# permanently save port forwarding changes:
sudo sysctl -p /etc/sysctl.conf


# port forward from 80 to 8080:
sudo iptables -A PREROUTING -t nat -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 8080


# open the Linux firewall to allow connections on port 80:
sudo iptables -A INPUT -p tcp -m tcp --sport 80 -j ACCEPT
sudo iptables -A OUTPUT -p tcp -m tcp --dport 80 -j ACCEPT


# install git:
sudo yum install git


# install node:
sudo yum install nodejs npm --enablerepo=epel


# install grunt client:
sudo npm install -g grunt-cli


# add the PHASE environment variable to the instance
# possible values are "staging" and "production"
# ex. PHASE=staging
sudo vim /etc/environment


# create server folder:
mkdir ~/server


# add an entry to the local yum repository for MondoDB:
echo "[10gen]
name=10gen Repository
baseurl=http://downloads-distro.mongodb.org/repo/redhat/os/x86_64
gpgcheck=0" | sudo tee -a /etc/yum.repos.d/10gen.repo


# install MongoDB:
sudo yum -y install mongo-10gen-server mongodb-org-shell


# set ownership of data folder
# TODO: is this necessary?
sudo chown mongod:mongod ~/server/db


# disconnect from ec2
exit


# sync server files:
./sync


# reconnect to ec2
./connect


# move into server folder
cd ~/server


# install dependencies:
npm install


# start the mongo server and keep it running:
mongod --fork --dbpath ~/server/db/data/ --logpath ~/server/db/logs/mongod.log


# install forever node process monitor:
sudo npm install forever -g


# start the node server and keep it running:
forever start ~/server/bin/www


# disconnect from ec2
exit


# view the site
./go





--- SHUTTING DOWN THE SERVERS ---


# go to tools/bin folder in terminal
cd /path/to/tools/bin/


# connect to ec2 instance:
./connect


# stop the node server
# if you have multiple node processes running you can "forever list" for the process id
forever stop 0


# enter mongo shell
mongo


# switch to amdin
use amdin


# shut down server
db.shutdownServer()


# shut down server again!!!
db.shutdownServer()


# exit mongo process
# can also ctrl + c
quit()


# disconnect from ec2
exit





--- REFERENCES ---


phantomjs binaries:
https://bitbucket.org/ariya/phantomjs/downloads


setting up a node.js server on ec2:
http://www.lauradhamilton.com/how-to-set-up-a-nodejs-web-server-on-amazon-ec2


adding a custom tcp port to aws security group:
http://stackoverflow.com/questions/26338301/ec2-how-to-add-port-8080-in-security-group





