//let name = prompt("what is your name?")
//console.log("Hello "+name)

//let age = prompt("What is your age?")
/*
if (age<=10){
    console.log("Hi "+name+" Your a baby because your "+age+" Years old")
} else if ((age>=11)&&(age<=19)){
    console.log("Hi "+name+" Your a Teenager because your "+age+" Years old")
} else if ((age>=20)&&(age<=35)){
    console.log("Hi "+name+" Your a Young Adult because your "+age+" Years old")
} else if ((age>=36)&&(age<=56)){
    console.log("Hi "+name+" You Should not be living in your moms basment becuase you alredy an adult because your "+age+" Years old")
} else if ((age>=66)&&(age<=90)){
    console.log("Hi "+name+" Your a Old Person because your "+age+" Years old")
}  else if ((age>=91)&&(age<=1000000)){
    console.log("Hi "+name+" You Should be dead right know because your "+age+" Years old and that is way longer then normal")
}
*/

const logo = document.querySelector(".header__logo")


let list = [1, 5, 3, 4, 8, 99, 12, 432, 46, 7, 345, 778]
for (let index = 0; index < list.length; index++) {
    if (list[index]==12) {
        console.log("yes")
        break
    }
}

logo.addEventListener("click",function(){
    alert("less go")
})


function test() {
    alert("This is useless")
}
//test()
let check = document.querySelector(".input")

check.addEventListener("selected",function(){
    if (check.selected == true) {
        test()
    }
})

