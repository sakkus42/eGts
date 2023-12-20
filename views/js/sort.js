function openSortList(){
    const display = $(".sortList").css("display");
    if (display == '' || display == 'none'){
        $(".sortList").css("display", "flex");
    }else{
        $(".sortList").css("display", "none");
    }    
}

$(document).on("click", function(event){
    if(!$(event.target).closest('#selectedSort').length) {
        $(".sortList").css("display", "none");
    }
});

function alphaSort(flag){
    var myDivs = $(".rowProduct");
    console.log($('#sortText').text())
    if (flag){
        $('#sortText').text('Alfabetik (A-Z)')
    }else{
        $('#sortText').text('Alfabetik (Z-A)')
    }

    var divs = myDivs.children('.column').get();
    
    divs.sort(function(a, b) {
        var titleA = $(a).data('title').toLowerCase();
        var titleB = $(b).data('title').toLowerCase();
        if (flag){
            return titleA.localeCompare(titleB);
        }else{
            return titleB.localeCompare(titleA);
        }
    });
    
    $.each(divs, function(idx, div) { myDivs.append(div); });
}

function priceSort(flag){
    if (flag){
        $('#sortText').text('En yüksek fiyata göre')
    }else{
        $('#sortText').text('En düşük fiyata göre')
    }

    var myDivs = $(".rowProduct");
  
    var divs = myDivs.children('.column').get();
    
    
    divs.sort(function(a, b) {
        var priceA = $(a).data('price');
        var priceB = $(b).data('price');
        if (flag){
            return priceB - priceA;
        }else{
            return priceA - priceB;
        }
    });
    
    $.each(divs, function(idx, div) { myDivs.append(div); });
}

function originSort(){
    $('#sortText').text('Öne çıkan');
    var myDivs = $(".rowProduct");
  
    var divs = myDivs.children('.column').get();
    
    
    divs.sort(function(a, b) {
        var priceA = $(a).data('index');
        var priceB = $(b).data('index');
        return priceA - priceB;    
    });
    
    $.each(divs, function(idx, div) { myDivs.append(div); });
}
