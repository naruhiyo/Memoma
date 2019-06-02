echo 'removing *.js in src directory...';
rm src/main.js;
rm src/app/modules/*.js;
rm src/app/modules/models/*.js;
rm src/public/modules/*.js;
echo 'copying *.js in src directory...';
cp build/src/main.js src/;
cp build/src/app/modules/*.js src/app/modules/;
cp build/src/app/modules/models/*.js src/app/modules/models/;
cp build/src/public/modules/*.js src/public/modules/;
echo 'done'
