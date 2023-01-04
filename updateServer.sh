#!/bin/bash

while :
do
    rsync -a --exclude=node_modules/ --exclude=.env . root@services.competitionpolicyinternational.com:/home/send-email/
    sleep 15
done

