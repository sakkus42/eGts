// to get current year

// $('#search').addEventListener('click', () => {
// })

function searchOpen(){
    console.log(document.getElementsByClassName('searchInput')[0].style.display);
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
    // console.log(document.getElementById("myFormSign").style.display);
    if (document.getElementById("myFormSign").style.display == "" || document.getElementById("myFormSign").style.display == "none"){
        document.getElementById("myForm").style.display = "none";
        document.getElementById("myFormSign").style.display = "flex";
    }else{
        console.log("selam1");
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
