let myFacebookToken;
$(document).ready(()=>{

  if(window.location.search.split('=').length>1){
      myFacebookToken=window.location.search.split('=')[1];
    }
  if(myFacebookToken==null || myFacebookToken==""){
    alert("No user found");
  }
  else{
    getAllDetails();
  }

  $('ul li a').click(function(){ $('li a').removeClass("active"); $(this).addClass("active"); });

});

let getAllDetails =()=>{
  $.ajax({
    type:'GET',
    dataType:'json',
    async:true,
    url:'https://graph.facebook.com/me?fields=id,name,picture.type(large),cover,feed.limit(10){attachments},quotes&access_token='+myFacebookToken,
    success:(response)=>{
      $('#dataSection').css('display','flex');
      $('#userName').append(response.name);

        $('#nav-userName').append(response.name);
        $('#nav-profilePhoto').html('<img src="'+response.picture.data.url+'"/>')

      $('#favouriteQuote').append(response.quotes);
      $('#profilePhoto').html('<img src="'+response.picture.data.url+ '" class="img-fluid profileHeight"/>');
      $('#cover').css('background-image','url('+response.cover.source+')');

      if (window.matchMedia('(max-width: 768px)').matches){
          $('.nav-tabs').css('margin-left','0');
          $('.tab-content').css('margin-left','0');
          $('#feeds').css('width','100%');
          $('#nav-profilePhoto').css('display','none');
          $('#nav-userName').css('display','none');
          $('body').css('font-size','0.7em');
      }
      if (window.matchMedia('(max-width: 480px)').matches){
         $('#cover').css('height','40vh');
      }

      $.ajax({
         type:'GET',
         dataType:'json',
         async:true,
         url:`https://graph.facebook.com/me/feed?&access_token=`+myFacebookToken,
         success:(feed_data)=>{

          let feeds=feed_data.data;

          let stories=response.feed.data;
          let i=0;
          for(story in stories){
            if(stories[story].attachments == null){
              continue;
            }else {
              for(feed in feeds){
                if(feeds[feed].id==stories[story].id){
                  let source=stories[story].attachments.data[0].media.image.src;
                  $('#feed-thumb').append("<div id=feeds><div id=thumb-title"+i+" class=feed-title>"+feeds[feed].story+"</div> <div id=feed-thumb"+i+" class=feed-thumbnail> <img src="+source+" class=img-thumbnail /> </div></div>");
                  i++;
                }
              }
            }
          }
         },
         error:(err)=>{
         }
       });

    },
    error: (err)=>{
      console.log(err.responseJSON.error.message);
    }

  });
}
