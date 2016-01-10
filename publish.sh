rm -R publish
mkdir publish


cp -R datatable publish/datatable
cp -R logs publish/logs
cp -R node_modules publish/node_modules
cp datatable.js publish/
cp log.js publish/
cp main.js publish/
cp package.json publish/
cp server.js publish/

cd client
sencha app build
cd ../
cp -R client/build/production/datagrep publish/client
mkdir publish/game
mkdir publish/game/undefined
cp -R client/game/undefined/ publish/game/undefined/
