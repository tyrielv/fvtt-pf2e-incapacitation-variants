MANIFEST_SEARCH_PATTERN='(\s\"(manifest)\"\: \"https:\/\/github.com\/tyrielv\/fvtt-pf2e-incapacitation-variants\/releases\/).*(\/(module.json)\",)'
DOWNLOAD_SEARCH_PATTERN='(\s\"(download)\"\: \"https:\/\/github.com\/tyrielv\/fvtt-pf2e-incapacitation-variants\/releases\/).*(\/(fvtt-pf2e-incapacitation-variants.zip)\",)'
#For version specific download
VERSION_MAIN_REPLACE="\1download/v$1\3"
#For latest download
LATEST_MAIN_REPLACE="\1latest/download\3"

sed -i -e 's|\(.*"version"\): "\(.*\)",.*|\1: '"\"$1\",|" module.json &&
sed -i -r s"~${MANIFEST_SEARCH_PATTERN}~${LATEST_MAIN_REPLACE}~" module.json &&
sed -i -r s"~${DOWNLOAD_SEARCH_PATTERN}~${VERSION_MAIN_REPLACE}~" module.json &&
cp module.json dist &&
sed -i -e 's|\(.*"version"\): "\(.*\)",.*|\1: '"\"$1\",|" package.json &&
npm install &&
cd dist || exit &&
zip -r fvtt-pf2e-incapacitation-variants.zip ./* &&
cd ..
