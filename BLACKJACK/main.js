let KARTY_NAMES = ["(null)", "(null)", "2", "3", "4", "5", "6", "7", "8", "9", "10", "j", "q", "k", "a"]; //punkty: j=10, q=10, k=10, a=11
let wszystkie_karty = []; //Tutaj lądują wszystkie niewidzialne karty
let KARTY = 1; // Do odliczenia kart dla ID
let dollars = 1000000; //Ile ogólnie posiadamy $
let postawiono = 0; //Ile aktualnie mamy postawionych $
let Tick = 0; //Jaka tura (wygrana = , przegrana = -1)
const DOLLARS = document.getElementById("dollars");
const TOKEN_BOX = document.getElementById("tokenBox");
let tmpCARD; //TMP KARTA PRZECIWNIKA

//OKIENKO 1
const BOX_1 = document.getElementById("box1");
let PUNKTY_1;
let pwr1 = 0;

//OKIENKO 2
const BOX_2 = document.getElementById("box2");
let PUNKTY_2;
let pwr2 = 0;

function main()
{
    //usuwanie kart
    if(wszystkie_karty.length > 0)
    {
        wszystkie_karty = [];
        KARTY = 1;
        BOX_1.textContent = "";
        BOX_2.textContent = "";

        //WYGRANA
        if(Tick == 12)
        dollars += postawiono*2;
        else
        //REMIS
        if(Tick == 10)
        dollars += postawiono;

        postawiono = 0;
        TOKEN_BOX.textContent = "";
        pwr1 = 0;
        pwr2 = 0;
    }
    Tick = 0;

    //Tworzenie talii kart
    for(let i = 2; i < KARTY_NAMES.length; i++) for(let j = 1; j <= 4; j++) StworzKarte(j, i);
    
    //LICZNIK PUNKTÓW
    PUNKTY_1 = document.createElement("p");
    PUNKTY_1.id = "points1";
    PUNKTY_2 = document.createElement("p");
    PUNKTY_2.id = "points2";
    BOX_1.appendChild(PUNKTY_1);
    BOX_2.appendChild(PUNKTY_2);

    //Tasowanie kart
    wszystkie_karty.sort( function() {return 0.5 - Math.random()} );
    wszystkie_karty.sort( function() {return 0.5 - Math.random()} );
    wszystkie_karty.sort( function() {return 0.5 - Math.random()} );

    //Reset $ i postawionych $
    DOLLARS.textContent = "$ "+dollars;
    STAWKA.textContent = postawiono;
}

function Game()
{
    switch (Tick)
    {
        //Naciśnięto "Gotowy!"
        case 1:
            if(pwr1 == 21)
            {
                tmpCARD.style.filter = "brightness(1)";
                PUNKTY_2.textContent = pwr2;
                sleep(300).then(() => { 
                    Tick = 12;
                    alert("BLACKJACK!");
                    main();
                 });
            }

            const tmpKarta_1 = wszystkie_karty.pop();
            const tmpKarta_2 = wszystkie_karty.pop();
            pwr2 = tmpKarta_1.power + tmpKarta_2.power;
            
            //2 Asy \/
            if(pwr2 == 22) pwr2 = 12;

            BOX_2.appendChild(tmpKarta_1);
            BOX_2.appendChild(tmpKarta_2);

            tmpCARD = tmpKarta_2;
            tmpCARD.style.filter = "brightness(0)";
            
            Tick = 2;
        break;

        //Naciśnięto "Zostaw"
        case 3:
            tmpCARD.style.filter = "brightness(1)";
            PUNKTY_2.textContent = pwr2;
            sleep(300).then(() => { 
                if(pwr2 < 17)
                {
                    const tmpKarta_1 = wszystkie_karty.pop();
                    if(tmpKarta_1.power == 11) pwr2++; else pwr2 += tmpKarta_1.power;
                    PUNKTY_2.textContent = pwr2;
                    BOX_2.appendChild(tmpKarta_1);
                    Game();
                }
                else
                if(pwr1 > pwr2 || pwr2 > 21)
                {
                    Tick = 12;
                    alert("WYGRANA!");
                    main();
                }
                else
                if(pwr1 == pwr2)
                {
                    Tick = 10;
                    alert("REMIS!");
                    main();
                }
                else
                {
                    Tick = 11;
                    alert("PRZEGRANA!");

                    if(dollars == 0)
                    {
                        alert("SKOŃCZYŁY CI SIĘ $, RESTART!");
                        location.reload();
                    }
                    else
                    main();
                }
            });
        break;

        default: console.log("[ ! ] Taki Tick nie został odnaleziony w Game()."); break;
    }
}

//GOTOWY!
function Deal()
{
    if(Tick == 0 && postawiono > 0)
    {
        const tmpKarta_1 = wszystkie_karty.pop();
        const tmpKarta_2 = wszystkie_karty.pop();
        pwr1 = tmpKarta_1.power + tmpKarta_2.power;
        
        //2 Asy \/
        if(pwr1 == 22) pwr1 = 12;

        PUNKTY_1.textContent = pwr1;

        BOX_1.appendChild(tmpKarta_1);
        BOX_1.appendChild(tmpKarta_2);
        
        Tick = 1;
        Game();
    }
    else
    if(postawiono == 0)
    {
        alert("Musisz coś postawić!");
    }
    else
    {
        alert("Już rozpoczęto!");
    }
}

//Podbij
function Hit()
{
    if(Tick == 2)
    {
        const tmpKarta_1 = wszystkie_karty.pop();
        
        if(tmpKarta_1.power == 11) pwr1++; else pwr1 += tmpKarta_1.power;

        PUNKTY_1.textContent = pwr1;

        BOX_1.appendChild(tmpKarta_1);
        
        if(pwr1 > 21)
        {
            sleep(300).then(() => { 
                Tick = 11;
                alert("PRZEGRANA!");

                if(dollars == 0)
                {
                    alert("SKOŃCZYŁY CI SIĘ $, RESTART!");
                    location.reload();
                }
                main();
             });
        }
        else
        if(pwr1 == 21)
        {
            tmpCARD.style.filter = "brightness(1)";
            PUNKTY_2.textContent = pwr2;
            sleep(300).then(() => { 
                Tick = 12;
                alert("BLACKJACK!");
                main();
            });
        }
    }
    else
    {
        alert("Nie twoja kolei!");
    }
}

function Stand()
{
    if(Tick == 2)
    { 
        Tick = 3;
        Game();
    }
    else
    {
        alert("Nie twoja kolei!");
    }
}

function POSTAW(x)
{
    if(x > dollars)
    alert("Nie posiadasz tylu $!");
    else
    if(Tick == 0)
    {
        dollars -= x;

        const tmpToken = document.createElement("img");
        tmpToken.src = "grafika/zetony/" + x + ".png";
        TOKEN_BOX.appendChild(tmpToken);

        postawiono += x;
        DOLLARS.textContent = "$ "+dollars;
    }
    else
    {
        alert("JUŻ ROZPOCZĘTO!");
    }
}

function StworzKarte(setColorID, setPower)
{
    const tmpKarta = document.createElement("img");
    tmpKarta.classList.add("karta");

    tmpKarta.id = "Karta_"+KARTY;
    tmpKarta.colorID = setColorID;
    
    //KARTY_NAMES[14] to AS który ma posiadać wartość 11 punktów, zaś wszelkie karty KARTY_NAMES[x] gdzie x > 10 (walet wzwyż) mają mieć wartość 10 punktów.
    if(setPower == 14) tmpKarta.power = 11;
    else
    if(setPower > 10) tmpKarta.power = 10;
    else
    tmpKarta.power = setPower;

    tmpKarta.src = "grafika/"+tmpKarta.colorID+"_"+KARTY_NAMES[setPower]+".png";
    tmpKarta.draggable = false;

    wszystkie_karty.push(tmpKarta);
    KARTY++;
}


function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
function LosujInta(max){ return Math.floor(Math.random() * max); }


main();