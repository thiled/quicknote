document.oncontextmenu = function(e) {
  e.preventDefault();
};
document.onmousedown=function(e){
    console.log(e.button)
}