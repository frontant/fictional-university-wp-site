var devEnvDir = '/home/anton/Courses_Projects/fictional-university-wp-site/src/';
var wpContentDir = '/var/www/html/wp/wp-content/';


exports.urlToPreview = 'http://localhost/wp/';

exports.themeSourceCode = devEnvDir + 'theme/';
exports.pluginsSourceCode = devEnvDir + 'mu-plugins/';

exports.themeLocation = wpContentDir + 'themes/fictional-university-theme/';
exports.pluginsLocation = wpContentDir + 'mu-plugins/';

// If you're using Local by Flywheel you will
// want your settings to be similar to the examples below:

// exports.themeLocation = './public/wp-content/themes/fictional-university-theme/';
// exports.urlToPreview = 'http://fictional-university.local/';

// Simply remove the two slashes at the front of those lines
// to uncomment them and then delete lines #1 and #2.

// Be SURE to update urlToPreview to YOUR domain and not mine.
// Be SURE to update themeLocation to YOUR theme folder name