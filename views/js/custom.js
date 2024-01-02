function searchOpen(){
    
    var header = document.querySelector('header');
    if (document.getElementsByClassName('searchInput')[0].style.display == '' || document.getElementsByClassName('searchInput')[0].style.display == 'none'){
        header.classList.add('sticky');
        document.getElementsByClassName('searchInput')[0].style.display = 'flex';
    }else{
        document.getElementsByClassName('searchInput')[0].style.display = 'none';
    }
}


var btn = document.querySelectorAll(".clickBtn");

btn.forEach(el => el.addEventListener("click", () => {
    if (document.getElementById("myFormSign").style.display == "" || document.getElementById("myFormSign").style.display == "none"){
        document.getElementById("myForm").style.display = "none";
        document.getElementById("myFormSign").style.display = "flex";
    }else{
        document.getElementById("myForm").style.display = "flex";
        document.getElementById("myFormSign").style.display = "none";
    };
    window.scrollTo({ top: 0, behavior: 'smooth' });
}));

// client section owl carousel
$(".client_owl-carousel").owlCarousel({
    loop: true,
    margin: 20,
    dots: false,
    nav: true,
    navText: [],
    autoplay: true,
    autoplayHoverPause: true,
    navText: [
        '<i class="fa fa-angle-left" aria-hidden="true"></i>',
        '<i class="fa fa-angle-right" aria-hidden="true"></i>'
    ],
    responsive: {
        0: {
            items: 1
        },
        768: {
            items: 2
        }
    }
});



const header = document.querySelector('.headerBar');

const originalOffset = header.offsetTop;
const headerHeight = header.offsetHeight;
let lastScroll = 0;

function handleScroll() {
  const scrollPosition = window.scrollY || window.pageYOffset;

  if (scrollPosition > originalOffset && scrollPosition > lastScroll) {
      header.classList.remove('sticky');
      
  } else {
      header.classList.add('sticky');
    
  }

  lastScroll = scrollPosition <= 0 ? 0 : scrollPosition; // Sayfanın en üstünde ise sıfırla
}

window.addEventListener('scroll', handleScroll);

