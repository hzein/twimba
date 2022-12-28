import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

let userProfileHandle = JSON.parse(localStorage.getItem("userProfile"))
if(!userProfileHandle){
    localStorage.setItem("userProfile", JSON.stringify("@ScrimbaZein"))
    userProfileHandle = "@ScrimbaZein"
}

let StoredTweetsData = JSON.parse(localStorage.getItem("tweetsData"))
if(!StoredTweetsData){
    localStorage.setItem("tweetsData",JSON.stringify(tweetsData))
    StoredTweetsData = Array.from(tweetsData)
}

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if(e.target.id === "tweet-your-reply"){
        handleTweetReply(e.target.dataset.tweetReply)
    }
    else if(e.target.dataset.deleteTweet){
        handleDeleteTweetclick(e.target.dataset.deleteTweet)
    }
})
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = StoredTweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = StoredTweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        StoredTweetsData.unshift({
            handle: `@ScrimbaZein`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    render()
    tweetInput.value = ''
    }

}

function handleTweetReply(tweetId){
    const tweetReplyText = document.getElementById(`tweet-reply-text-${tweetId}`)
    if(tweetReplyText.value){
        const tweetObj = StoredTweetsData.filter(tweet => {
        return tweet.uuid === tweetId
        })[0]
        tweetObj.replies.unshift({
                    handle: `@ScrimbaZein`,
                    profilePic: `images/scrimbalogo.png`,
                    tweetText: tweetReplyText.value
        })
        render()
        tweetReplyText.value = ''
    }
}

function handleDeleteTweetclick(tweetId){
    StoredTweetsData.splice(StoredTweetsData.findIndex(
        tweet => { return tweet.uuid === tweetId }),1)
    render()
}

function getFeedHtml(){
    let feedHtml = ``
    
    StoredTweetsData.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
                <div class="tweet-reply">
                    <div class="tweet-inner">
                        <img src="${reply.profilePic}" class="profile-pic">
                            <div>
                                <p class="handle">${reply.handle}</p>
                                <p class="tweet-text">${reply.tweetText}</p>
                            </div>
                        </div>
                </div>
                `
            })
        }
        
        let tweetMenuDots = `<span class="tweet-menu">
                            <i class="fa-solid fa-trash"
                            data-delete-tweet="${tweet.uuid}"
                            ></i>
                        </span>`
        feedHtml += `
        <div class="tweet">
            <div class="tweet-inner">
                <img src="${tweet.profilePic}" class="profile-pic">
                <div>
                    <p class="handle">${tweet.handle}</p>
                    <p class="tweet-text">${tweet.tweetText}</p>
                    <div class="tweet-details">
                        <span class="tweet-detail">
                            <i class="fa-regular fa-comment-dots"
                            data-reply="${tweet.uuid}"
                            ></i>
                            ${tweet.replies.length}
                        </span>
                        <span class="tweet-detail">
                            <i class="fa-solid fa-heart ${likeIconClass}"
                            data-like="${tweet.uuid}"
                            ></i>
                            ${tweet.likes}
                        </span>
                        <span class="tweet-detail">
                            <i class="fa-solid fa-retweet ${retweetIconClass}"
                            data-retweet="${tweet.uuid}"
                            ></i>
                            ${tweet.retweets}
                        </span>
                        ${(tweet.handle === userProfileHandle) ? tweetMenuDots : ""}
                    </div>   
                </div>            
            </div>
            <div class="hidden" id="replies-${tweet.uuid}">
                <div class="tweet-your-reply">
                    <input 
                    type="text" 
                    class="tweet-reply-text"
                    id="tweet-reply-text-${tweet.uuid}" 
                    placeholder="Tweet your reply" 
                    />
                    <button id="tweet-your-reply" data-tweet-reply="${tweet.uuid}">Tweet</button>
                </div>
                    ${repliesHtml}
            </div>   
        </div>
        `
   })
   return feedHtml 
}

function UpdateStoredData(){
    localStorage.setItem('tweetsData', JSON.stringify(StoredTweetsData))
}

function render(){
    UpdateStoredData()
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()

