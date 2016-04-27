var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var app = express()

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    // console.log(req,req???
    res.send('Hello world..')
})

app.post('/webhook/', function (req, res) {
        console.log((req.headers['x-forwarded-for'] || '').split(',')[0]|| req.connection.remoteAddress);

    messaging_events = req.body.entry[0].messaging
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i]
        sender = event.sender.id
        if (event.message && event.message.text) {
            text = event.message.text
             var   sub = ['shop','mobile','pant','bag','shoes','laptop','phone','pen','shirt'];
                for (i = 0; i < sub.length; i++) {
                if(text.toLowerCase().indexOf(sub[i]) > -1){
                    sendGenericMessage(sender,sub[i]) 
                            
                       
                    continue    
                }

            }
             request({
                          uri: "http://sheepridge.pandorabots.com/pandora/talk?botid=b69b8d517e345aba&skin=custom_input&input="+text,
                          method: "POST",
                          form: {
                          

                          }
                        }, function(error, response, body) {
                          var i=body.indexOf("<b>A.L.I.C.E.:</b>");
                           var str=body.substr(i+19,50);
                            var j=str.indexOf("<br/>");
                             var msg=body.substr(i+19,j);
                             if(j!=0)
                                 sendTextMessage(sender,msg)
                    });

 
           
        }
        if (event.postback) {
            text = JSON.stringify(event.postback)
            sendTextMessage(sender, "Events received: "+text.substring(0, 200), token)
            continue
        }
    }
    res.sendStatus(200)
})

//Enter facebook app page Token
var token = "";
function sendGenericMessage(sender,match_str) {
   
    if(match_str==="laptop" || match_str==="phone" || match_str==="mobile"|| match_str==="shop"){


           messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Elcectronins",
                    "subtitle": "Mobiles",
                    "image_url": "http://www.auroproducts.in/image/data/auro/mob2.png",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://www.messenger.com",
                        "title": "web url"
                    }, {
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for first element in a generic bubble",
                    }],
                }, {
                    "title": "Laptop",
                    "subtitle": "Element #2 of an hscroll",
                    "image_url": "http://www.freepngimg.com/download/laptop/17-laptop-notebook-png-image.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "Click Me..",
                        "payload": "Thank You ...",
                    }],
                }]
            }
        }
    }






    }else if(match_str==="shirt" || match_str==="pant" ){

   messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "clothes",
                    "subtitle": "Element #1 of an hscroll",
                    "image_url": "http://data.whicdn.com/images/18011899/large.png",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://www.messenger.com",
                        "title": "web url"
                    }, {
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for first element in a generic bubble",
                    }],
                }, {
                    "title": "Second card",
                    "subtitle": "Element #2 of an hscroll",
                    "image_url": "http://sierrasummitgear.com/product_images/q/127/S12-Peakline-Shirt-SS-Riptide__58630.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "Click Me..",
                        "payload": "Thank You ...",
                    }],
                }]
            }
        }
    }
    }else if(match_str==="shoes" || match_str==="bag"){

   messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "shoes",
                    "subtitle": "Element #1 of an hscroll",
                    "image_url": "http://pics.clipartpng.com/idownload-image.php?file=Brown_Elegant_Men_Shoes_PNG_Clipart-385.png",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://www.messenger.com",
                        "title": "web url"
                    }, {
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for first element in a generic bubble",
                    }],
                }, {
                    "title": "Second card",
                    "subtitle": "Element #2 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "Click Me..",
                        "payload": "Thank You ...",
                    }],
                }]
            }
        }
    }
    }//if end


    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function sendTextMessage(sender, text) {
    messageData = {
        text:text
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}
// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})

