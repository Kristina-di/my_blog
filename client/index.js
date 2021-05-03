const card = post =>{
  return `
  <div class="gradient-border" id="box">
  <div class="card z-depth-4">
          <div class="card-content">
            <span class="card-title">${post.title}</span>
            <p style="white-space: pre-line;">${post.text}</p>
            <small>${new Date(post.date).toLocaleDateString()}</small>
          </div>
          <div class="card-action">
            <button class="bubbly-button js-remove" data-id ="${post._id}">
              Delete Post
            </button>
          </div>
        </div>
      </div>
      </div>
  `
}
//======Button======
const animateButton = function(e) {

  e.preventDefault;
  //reset animation
  e.target.classList.remove('animate');
  
  e.target.classList.add('animate');
  setTimeout(function(){
    e.target.classList.remove('animate');
  },700);
};

var bubblyButtons = document.getElementsByClassName("bubbly-button");

for (var i = 0; i < bubblyButtons.length; i++) {
  bubblyButtons[i].addEventListener('click', animateButton, false);
}
//==================

//=======Header=====
// type anything here
const text = 'Welcome to My Blog';

// this function turns a string into an array
const createLetterArray = (string) => {
  return string.split('');
}

// this function creates letter layers wrapped in span tags
const createLetterLayers = (array) => {
  return array.map((letter) => {
      let layer = '';
      //specify # of layers per letter
      for (let i = 1; i <= 2; i++) {
        // if letter is a space
        if(letter == ' '){
          layer += '<span class="space"></span>';
        }else{
          layer += '<span class="letter-'+i+'">'+letter+'</span>';
        }
      }
      return layer;
  });
}

// this function wraps each letter in a parent container
const createLetterContainers = (array) => {
  return array.map((item) => {
    let container = '';
    container += '<div class="wrapper">'+item+'</div>';
    return container;
  });
}

// use a promise to output text layers into DOM first
const outputLayers = new Promise(function(resolve, reject) {
      document.getElementById('text').innerHTML = createLetterContainers(createLetterLayers(createLetterArray(text))).join('');
      resolve();
});

// then adjust width and height of each letter
const spans = Array.prototype.slice.call(document.getElementsByTagName('span'));
outputLayers.then(() => {
    return spans.map((span) => {
      setTimeout(() => {
        span.parentElement.style.width = span.offsetWidth+'px';
        span.parentElement.style.height = span.offsetHeight+'px';
      }, 250);
    });  
}).then(() => {
    // then slide letters into view one at a time
    let time = 250;
    return spans.map((span) => {
      time += 75;
      setTimeout(() => {
        span.parentElement.style.top = '0px';
      }, time);
    });
});
//==================

let posts = []
let modal
const BASE_URL = '/api/post'

class PostApi {
  static fetch() {
    return fetch(BASE_URL, {method: 'get'}).then(res => res.json())
  }

  static create(post){
    return fetch(BASE_URL, {
      method: 'post',
      body: JSON.stringify(post),
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(res =>res.json())
  }
  static remove(id) {
  return fetch(`${BASE_URL}/${id}`, {
    method: 'delete'
  }).then(res =>res.json())
  }
}



document.addEventListener('DOMContentLoaded', () =>{
  PostApi.fetch().then(backendPosts =>{
    posts = backendPosts.concat()
      renderPosts(posts)  
  })
  
  modal = M.Modal.init(document.querySelector('.modal'))
  document.querySelector('#createPost').addEventListener('click', onCreatePost)
  document.querySelector('#posts').addEventListener('click', onDeletePost)
})

function renderPosts(_posts = []){
  const $posts = document.querySelector('#posts')

  if(_posts.length > 0){
    $posts.innerHTML = _posts.map(post => card(post)).join(' ')
  }else{
    $posts.innerHTML = `<div class="center">No posts yet</div>`
  }
}

function onCreatePost(){
  const $title = document.querySelector('#title')
  const $text = document.querySelector('#text')

  if($title.value && text.value){
    const newPost ={
      title: $title.value,
      text: $text.value
    }
    PostApi.create(newPost).then(post =>{
      posts.push(post)
      renderPosts(posts)
    })
    modal.close()
    $title.value = ''
    $text.value = ''
    M.updateTextFields()
  }
}

function onDeletePost(event){
  if(event.target.classList.contains('js-remove') || event.target.parentNode.classList.contains('js-remove')){
    const decision = confirm('Are you sure?')

    if(decision){
      const id = event.target.getAttribute('data-id') || event.target.parentNode.classList.contains('data-id')

      PostApi.remove(id).then(() =>{
        const postIndex = posts.findIndex(post => post._id === id)
        posts.splice(postIndex,1)
        renderPosts(posts)
      })
    }
  }
}

//====Background======
// ---------
  // Functions
  // ---------

  var canvas = document.querySelector('canvas')
      canvas.width = document.body.clientWidth
      canvas.height = document.body.clientHeight
  var ctx = canvas.getContext('2d')
  var count = canvas.height
  var bubbles = []
  var bubbleCount = 20
  var bubbleSpeed = 1
  var popLines = 6
  var popDistance = 40
  var mouseOffset = {
    x: 0,
    y: 0
  }



  // --------------
  // Animation Loop
  // --------------

  function animate() {



    // ------------
    // Clear Canvas
    // ------------

    ctx.clearRect(0, 0, canvas.width, canvas.height)



    // ------------
    // Draw Bubbles
    // ------------

    ctx.beginPath();
    for (var i = 0; i < bubbles.length; i++) {
      // first num = distance between waves
      // second num = wave height
      // third num = move the center of the wave away from the edge
      bubbles[i].position.x = Math.sin(bubbles[i].count/bubbles[i].distanceBetweenWaves) * 50 + bubbles[i].xOff
      bubbles[i].position.y = bubbles[i].count
      bubbles[i].render()

      if(bubbles[i].count < 0 - bubbles[i].radius) {
        bubbles[i].count = canvas.height + bubbles[i].yOff
      } else {
        bubbles[i].count -= bubbleSpeed
      }
    }

    // ---------------
    // On Bubble Hover
    // ---------------

    for (var i = 0; i < bubbles.length; i++) {
      if(mouseOffset.x > bubbles[i].position.x - bubbles[i].radius && mouseOffset.x < bubbles[i].position.x + bubbles[i].radius) {
        if(mouseOffset.y > bubbles[i].position.y - bubbles[i].radius && mouseOffset.y < bubbles[i].position.y + bubbles[i].radius) {
          for (var a = 0; a < bubbles[i].lines.length; a++) {
            popDistance = bubbles[i].radius * 0.5
            bubbles[i].lines[a].popping = true
            bubbles[i].popping = true
          }
        }
      }
    }

    window.requestAnimationFrame(animate)
  }

  window.requestAnimationFrame(animate)



  // ------------------
  // Bubble Constructor
  // ------------------

  var createBubble = function() {
    this.position = {x: 0, y: 0}
    this.radius = 20 + Math.random() * 6
    this.xOff = Math.random() * canvas.width - this.radius
    this.yOff = Math.random() * canvas.height
    this.distanceBetweenWaves = 50 + Math.random() * 40
    this.count = canvas.height + this.yOff
    this.color = '#8bc9ee'
    this.lines = []
    this.popping = false
    this.maxRotation = 85
    this.rotation = Math.floor(Math.random() * (this.maxRotation - (this.maxRotation * -1))) + (this.maxRotation * -1)
    this.rotationDirection = 'forward'

    // Populate Lines
    for (var i = 0; i < popLines; i++) {
      var tempLine = new createLine()
          tempLine.bubble = this
          tempLine.index = i

      this.lines.push(tempLine)
    }

    this.resetPosition = function() {
      this.position = {x: 0, y: 0}
      this.radius = 8 + Math.random() * 6
      this.xOff = Math.random() * canvas.width - this.radius
      this.yOff = Math.random() * canvas.height
      this.distanceBetweenWaves = 50 + Math.random() * 40
      this.count = canvas.height + this.yOff
      this.popping = false
    }

    // Render the circles
    this.render = function() {
      if(this.rotationDirection === 'forward') {
        if(this.rotation < this.maxRotation) {
          this.rotation++
        } else {
          this.rotationDirection = 'backward'
        }
      } else {
        if(this.rotation > this.maxRotation * -1) {
          this.rotation--
        } else {
          this.rotationDirection = 'forward'
        }
      }

      ctx.save()
      ctx.translate(this.position.x, this.position.y)
      ctx.rotate(this.rotation*Math.PI/180)

      if(!this.popping) {
        ctx.beginPath()
        ctx.strokeStyle = '#8bc9ee'
        ctx.lineWidth = 1
        ctx.arc(0, 0, this.radius - 3, 0, Math.PI*1.5, true)
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(0, 0, this.radius, 0, Math.PI*2, false)
        ctx.stroke()
      }
      
      ctx.restore()

      // Draw the lines
      for (var a = 0; a < this.lines.length; a++) {
        if(this.lines[a].popping) {
          if(this.lines[a].lineLength < popDistance && !this.lines[a].inversePop) {
            this.lines[a].popDistance += 0.06
          } else {
            if(this.lines[a].popDistance >= 0) {
              this.lines[a].inversePop = true
              this.lines[a].popDistanceReturn += 1
              this.lines[a].popDistance -= 0.03
            } else {
              this.lines[a].resetValues()
              this.resetPosition()
            }
          }

          this.lines[a].updateValues()
          this.lines[a].render()
        }
      }
    }
  }



  // ----------------
  // Populate Bubbles
  // ----------------

  for (var i = 0; i < bubbleCount; i++) {
    var tempBubble = new createBubble()

    bubbles.push(tempBubble)
  }



  // ----------------
  // Line Constructor
  // ----------------

  function createLine() {
    this.lineLength = 0
    this.popDistance = 0
    this.popDistanceReturn = 0
    this.inversePop = false // When the lines reach full length they need to shrink into the end position
    this.popping = false

    this.resetValues = function() {
      this.lineLength = 0
      this.popDistance = 0
      this.popDistanceReturn = 0
      this.inversePop = false
      this.popping = false

      this.updateValues()
    }

    this.updateValues = function() {
      this.x = this.bubble.position.x + (this.bubble.radius + this.popDistanceReturn) * Math.cos(2 * Math.PI * this.index / this.bubble.lines.length)
      this.y = this.bubble.position.y + (this.bubble.radius + this.popDistanceReturn) * Math.sin(2 * Math.PI * this.index / this.bubble.lines.length)
      this.lineLength = this.bubble.radius * this.popDistance;
      this.endX = this.lineLength
      this.endY = this.lineLength
    }

    this.render = function() {
      this.updateValues()

      ctx.beginPath()
      ctx.strokeStyle = '#8bc9ee'
      ctx.lineWidth = 2
      ctx.moveTo(this.x, this.y)
      if(this.x < this.bubble.position.x) {
        this.endX = this.lineLength * -1
      }
      if(this.y < this.bubble.position.y) {
        this.endY = this.lineLength * -1
      }
      if(this.y === this.bubble.position.y) {
        this.endY = 0
      }
      if(this.x === this.bubble.position.x) {
        this.endX = 0
      }
      ctx.lineTo(this.x + this.endX, this.y + this.endY);
      ctx.stroke()
    }
  }



  // ---------------
  // Event Listeners
  // ---------------

  canvas.addEventListener('mousemove', mouseMove)

  function mouseMove(e) {
    mouseOffset.x = e.offsetX
    mouseOffset.y = e.offsetY
  }

  window.addEventListener('resize', function() {
    canvas.width = document.body.clientWidth
    canvas.height = document.body.clientHeight
  })


  // ---------------
  // Event Listeners
  // ---------------