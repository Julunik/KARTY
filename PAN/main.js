const P_MAIN = document.getElementById("p_main");
const TWOJE_KARTY = document.getElementById("twoje_karty");
const PRINT = document.getElementById("container");
let KARTY = 1;
let stopnie_kart = ["(null)", "9", "10", "j", "q", "k", "a"]; //powers: 0, 1, 2, 3, 4, 5, 6
let wszystkie_karty = [];
let pmain_karty = [];
let przeciwnik_karty = [];
let TURN = 0;
let FirstMove = false;
let faces = ["(😀)","(💻)"];

for(let i = 1; i<=6; i++) for(let j = 1; j <= 4; j++) StworzKarte(j, i);
main();

function main()
{
    wszystkie_karty.sort( function() {return 0.5 - Math.random()} );
    wszystkie_karty.sort( function() {return 0.5 - Math.random()} );
    wszystkie_karty.sort( function() {return 0.5 - Math.random()} );

    for(let i = 1; i<=12; i++)
    {
        //KARTA DO CIEBIE
        const tmpKarta = wszystkie_karty.pop();
        tmpKarta.setAttribute("onclick", "OnClick("+tmpKarta.id+")");
        TWOJE_KARTY.appendChild(tmpKarta);

        //KARTA DO PRZECIWNIKA
        const tmpKarta2 = wszystkie_karty.pop();
        przeciwnik_karty.push(tmpKarta2);
    }

    //search 9 <3 in karty przeciwnika => WTEDY TO ON ZACZYNA
    for(let i = 0; i < przeciwnik_karty.length; i++)
    {
        if(przeciwnik_karty[i].id == 1)
        {
            TWOJE_KARTY.style.display = "none";
            TURN = 1;
            sleep(300).then(() =>
            { 
                TypeMessage("Zaczyna pierwszy dzięki 9 ❤.");
                PolozKarte(przeciwnik_karty[i]);
                UsunZtablicy(przeciwnik_karty, przeciwnik_karty[i]);
                TURN = 0;
                TWOJE_KARTY.style.display = "block";
            });
            break;
        }
    }

    TypeMessage2("Gra rozpoczęta, rozdano karty.", "(🎮)");
}

function StworzKarte(setColorID, setPower)
{
    const tmpKarta = document.createElement("img");

    tmpKarta.id = KARTY;
    tmpKarta.colorID = setColorID;
    tmpKarta.power = setPower;

    tmpKarta.src = "grafika/"+tmpKarta.colorID+"_"+stopnie_kart[tmpKarta.power]+".png";
    tmpKarta.draggable = false;

    KARTY++;
    wszystkie_karty.push(tmpKarta);
}

function DobierzKarty()
{
  if(pmain_karty.length > 0 && TURN == 0)
  {
    for(let i = 1; i <= 3; i++)
    {
        if(pmain_karty.length > 0)
        {
            const tmpKarta = pmain_karty.pop();
            tmpKarta.removeAttribute("style");
            tmpKarta.setAttribute("onclick", "OnClick("+tmpKarta.id+")");
            TWOJE_KARTY.appendChild(tmpKarta);
        }
        else
        break;
    }

    TWOJE_KARTY.style.display = "none";
    TypeMessage("Dobrano karty.");
    TURN = 1;
    sleep(300).then(() => { 
        BotTurn();
    });
  }
  else
  {
    alert("Nie można teraz zebrać kart z puli.");
  }
}

function TypeMessage(string)
{
    const d = new Date();
    let HOUR = d.getHours();
    let MINUTE = d.getMinutes();
    let SECOND = d.getSeconds();
    if(HOUR < 10) HOUR = "0"+HOUR;
    if(MINUTE < 10) MINUTE = "0"+MINUTE;
    if(SECOND < 10) SECOND = "0"+SECOND;

    const message = document.createElement("p");
    message.textContent = "[ "+HOUR+":"+MINUTE+":"+SECOND+" ] "+faces[TURN]+" ▶ "+string;
    PRINT.insertAdjacentElement('afterbegin', message);
}

function TypeMessage2(string, customFace)
{
    const d = new Date();
    let HOUR = d.getHours();
    let MINUTE = d.getMinutes();
    let SECOND = d.getSeconds();
    if(HOUR < 10) HOUR = "0"+HOUR;
    if(MINUTE < 10) MINUTE = "0"+MINUTE;
    if(SECOND < 10) SECOND = "0"+SECOND;

    const message = document.createElement("p");
    message.textContent = "[ "+HOUR+":"+MINUTE+":"+SECOND+" ] "+customFace+" ▶ "+string;
    PRINT.insertAdjacentElement('afterbegin', message);
}

function BotTurn()
{
    //SZUKANIE CZY BOT MA KARTE DO POŁOŻENIA
    for(let i = 0; i < przeciwnik_karty.length; i++)
    {
        if(pmain_karty.length == 0 || przeciwnik_karty[i].power >= pmain_karty[pmain_karty.length-1].power)
        {
            TypeMessage("Przeciwnik położył kratę.");
            PolozKarte(przeciwnik_karty[i]);
            UsunZtablicy(przeciwnik_karty, przeciwnik_karty[i]);
            TURN = 0;
            break;
        }
    }

    //SPRAWDZANIE CZY BOT WYGRAŁ
    if(przeciwnik_karty.length == 0)
    {
        sleep(100).then(() => { 
            alert("PRZEGRANA!");
            location.reload();
        });
    }

    //BOT NIE MIAŁ DO POŁOŻENIA KART - MUSI BRAĆ CHYBA ŻE PMAIN puste
    if(TURN > 0)
    {
        TypeMessage("Przeciwnik dobrał karty.");

        if(pmain_karty.length > 0)
        for(let i = 1; i <= 3; i++)
        {
            if(pmain_karty.length > 0)
            {
                const tmpKarta = pmain_karty.pop();
                przeciwnik_karty.push(tmpKarta);
                P_MAIN.removeChild(tmpKarta);
            }
            else
            break;
        }
        TURN = 0;
    }
    TWOJE_KARTY.style.display = "block";
}

const UsunZtablicy = (arr, item) => {
    let index = arr.indexOf(item);
    return index !== -1 && arr.splice(index, 1);
};

function PolozKarte(item)
{
    if(Math.floor(Math.random()*2) == 0)
    item.style.transform = "rotate(" + Math.floor(Math.random()*360+0) + "deg)";
    else
    item.style.transform = "rotate(" + -Math.floor(Math.random()*360+0) + "deg)";
    
    item.removeAttribute("onclick");
    pmain_karty.push(item);
    
    P_MAIN.appendChild(item);
}

function OnClick(id_karta)
{
    if(TURN == 0)
    {
        const tmpKarta = document.getElementById(id_karta);

        if(
            (pmain_karty.length == 0 && tmpKarta.id == 1 && FirstMove == false) || 
            (pmain_karty.length > 0 && tmpKarta.power >= pmain_karty[pmain_karty.length-1].power) || 
            (pmain_karty.length == 0 && FirstMove == true)
        )
        {
            PolozKarte(tmpKarta);
            if(FirstMove == false) FirstMove = true;

            if(TWOJE_KARTY.childElementCount == 0)
            {
                sleep(100).then(() => { 
                    alert("WYGRANA!");
                    location.reload();
                 });
            }
            else
            {
                TypeMessage("Położono kartę.");

                TWOJE_KARTY.style.display = "none";
                TURN = 1;
                sleep(300).then(() => { 
                    BotTurn();
                 });
            }
        }
    }
}

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
function LosujInta(max){ return Math.floor(Math.random() * max); }