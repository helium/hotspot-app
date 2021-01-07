#!/usr/bin/env bash

# add required app center environment variables into a .env file for use with react-native-config
echo ONE_SIGNAL_APP_ID=$ONE_SIGNAL_APP_ID >> .env
echo MAPBOX_ACCESS_TOKEN=$MAPBOX_ACCESS_TOKEN >> .env
echo STAKING_API_BASE_URL=$STAKING_API_BASE_URL >> .env
echo WALLET_API_BASE_URL=$WALLET_API_BASE_URL >> .env
echo STAKING_TOKEN=$STAKING_TOKEN >> .env
