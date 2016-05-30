
//Twitter ------------------------------------------------
const Twitter       = require("node-twitter-api");
const ffmpeg        = require('fluent-ffmpeg');
const fs            = require('fs');
const cp            = require('child_process');
const pkgcloud      = require('pkgcloud');
const d             = require('domain').create();

//on error streaming
d.on('error', function(error,r){
 console.log(error);
});

module.exports = {
  index: function (req, res) {

    var id      = req.query.id;
    var dir     = '/home/oldspice/videos';
    var video   = dir+'/video.mp4';
    var audio   = dir+'/audio.mp3';
    var outname = id+'.mp4';
    var output  = dir+'/'+outname;
        //Creating personalized video
        var str = 'rm '+output+' & ffmpeg  -i '+video+' -i '+audio+' -vcodec copy -shortest -strict -2 '+ output;
        var wp  = cp.exec(str);
        //On finished video process
        wp.on('exit', d.bind(function (code) {
          if( code == 1){
            console.log("Error video compiling");
            res.json({code:1,msg:"Video has not created! "});
          }else{
            console.log('Video compiling finalized', {tid:parseInt(id)});
            //Finding the tweet document
            Tweets.tenant('oldspice').findOne({"tweets.tid":parseInt(id)}).exec(function(e,doc){
              for(x in doc.tweets ){
                //finding the subdocument
                if(doc.tweets[x].tid == parseInt(id) ){
                  doc.tweets[x].media = {
                    filename : outname,
                    url: 'http://416839393cdecb9fe301-29bdff82c8d50c2971f1a8d12f5e404d.r9.cf1.rackcdn.com/'+outname
                  }
                  //save data
                  doc.save( function(rs){
                      //Uploading file to CDN
                      var size = fs.statSync(output)["size"];
                      var client = pkgcloud.providers.rackspace.storage.createClient({
                        username: 'pinochoproject',
                        apiKey: '48a104f4f5f21aef36e22c86ecba0e22',
                        region: 'DFW'
                      });
                      var readStream = fs.createReadStream(output);
                      var writeStream = client.upload({
                        container     : 'oldspice',
                        remote        : outname,
                        size          : size
                      });
                      writeStream.on('error', function(err) {
                       console.log("Error video storage in CDN \n\r");
                       res.json({code:101,msg:"created but it cant uploaded to CDN "});
                     });
                      writeStream.on('success', function(file) {
                        console.log("video upload finalized\n\r");
                        res.json({code:0,msg:"video finalized"});
                      });
                      readStream.pipe(writeStream);
                      //-------------
                    });
}
}
});
}
}));
},
};

//ffmpeg -i INPUT.mov -acodec libfaac -ac 2 -ab 128k -vcodec libx264 -vpre hq -wpredp 0 -s 1280x720 -crf 24 -threads 0 OUTPUT.mp4
// ffmpeg -i oldspice.mp4 -vcodec copy -an video.mp4
// ffmpeg -i video.mp4 -i audio.mp3 -map 0:0 -map 1:0 -vcodec copy -acodec copy output.mp4
// ffmpeg -i video.mp4 -i audio.mp3 -map 0:0 -map 1:0 -shortest output.mp4
// ffmpeg  -i video.mp4 -i audio.mp3 -map 0:0 -map 1:0 -vcodec copy  -shortest -strict -2 final.mp4
// ffmpeg -i input.avi -b:v 64k -bufsize 64k output.avi



