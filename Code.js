let cards_HTML = document.getElementsByClassName('card_img');
let cards = new Array();/*карты как объекты js*/
let card_values = new Array("Валет", "Дама", "Туз", "Король", "Джокер", "Десять", "Девять", "Восемь","Семь", "Шесть");
let card_values_seted = new Array();/*Уже заданные значения карт(со старта - пустой массив)*/
let motion_is_doed = false;
let game_is_over = false;
let rotated_cards_on_motion = new Array;
let timeout_off_rotate_is_doed = false;
let fps = 60;/*частота вызова Update*/
class Card {
  static cards_rotated = 0;
  static cards_rotated_All = 0;
  static Get_rotated_cards = ()=>{
    for (let i = 0; i < cards.length; i++) {
      if ( cards[i].isRotated == true && cards[i].Is_played_in_game == false ) {
        rotated_cards_on_motion.push( cards[i] );
      }
    }
    return rotated_cards_on_motion;
  }
  static Get_random_value_card_no_reiteration = ()=>{
    let random_value_nomber = getRandomInRange(0, card_values.length - 1);
    if ( card_values_seted.length < card_values.length ) {
      while ( card_values_seted.indexOf(card_values[random_value_nomber]) != -1 ) {
        random_value_nomber = getRandomInRange(0, card_values.length - 1);
      }
      card_values_seted.push( card_values[random_value_nomber] );
    }/*Если это не последнее значение*/
    /*else if( card_values_seted.length == card_values.length - 1 ){

    }/*Если это последнее значение*/
    return card_values[random_value_nomber];
  }
  constructor(number_of_card) {
    this.card_number = number_of_card;
    this.card_HTML = cards_HTML[number_of_card - 1];
    this.card_value = "";
    this.card_back_src = "Спрайты/Карты Сзади.jpg";
    this.card_forward_src = `Спрайты/${this.card_value}.png`;
    this.isRotated = false; /*повёрнута ли передней стороной*/
    this.second_card = null;/*позже перегазначается(в Find_second_card)*/
    this.Is_played_in_game = false;
    this.Rotate_card = ()=>{
      if ( this.isRotated == false ) {
        this.card_HTML.src = this.card_forward_src;
        this.isRotated = true;
        Card.cards_rotated++;
        Card.cards_rotated_All++;
      } else if( this.isRotated == true ) {
        this.card_HTML.src = this.card_back_src;
        this.isRotated = false;
        Card.cards_rotated--;
        Card.cards_rotated_All--;
      }
    }
    this.Find_second_card = ()=>{
      if (this.second_card == null) {
        let random_number_of_card =  getRandomInRange(0, cards.length - 1);
        while ( cards[random_number_of_card].second_card != null || cards[random_number_of_card] == this ) {
          /*пока мы не найдём карту без пары()*/
          random_number_of_card = getRandomInRange(0, cards.length - 1);
        }
        this.second_card = cards[random_number_of_card];
        this.second_card.second_card = this;
      }
    }
    this.OnClick = ()=>{
      if ( Card.cards_rotated < 2 && this.isRotated == false && motion_is_doed == false ) {
        this.Rotate_card();
        /*тут число перевёрнутых карт увеличивается на 1, так что то, что написано дальше, имеет смысл*/
        if ( Card.cards_rotated == 2 ) {
          motion_is_doed = true;
        }
      }
    }
    this.Set_card_value = (value)=>{
      this.card_value = value;
      this.card_forward_src = `Спрайты/${value}.png`;
    }/*Установить, что это за карта*/
  }
}

function getRandomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
function Init_cards() {
  for (var i = 0; i < cards_HTML.length; i++) {
    cards[i] = new Card(i + 1);
    /*+1 чтобы номер карты начинался с 1*/
  }
}
function Set_second_cards_for_all() {
  for (let i = 0; i < cards.length; i++) {
    cards[i].Find_second_card();
  }
}
function OnClick_On_Card(card_number) {
  cards[card_number - 1].OnClick();
}
function End_of_motion(){
  if ( timeout_off_rotate_is_doed == false ) {
    setTimeout( ()=>{
      let rotated_card_on_motion_1 = Card.Get_rotated_cards()[0];
      let rotated_card_on_motion_2 = Card.Get_rotated_cards()[1];
      if ( rotated_card_on_motion_1.second_card != rotated_card_on_motion_2 ) {
        rotated_card_on_motion_1.Rotate_card();
        rotated_card_on_motion_2.Rotate_card();
      } else {
        if (Card.cards_rotated_All == 20) {
          game_is_over = true;
        }
        rotated_card_on_motion_1.Is_played_in_game = true;
        rotated_card_on_motion_2.Is_played_in_game = true;
      }
      rotated_cards_on_motion = new Array();/*Сброс перевёрнутых за ход*/
      motion_is_doed = false;
      Card.cards_rotated = 0;
      timeout_off_rotate_is_doed = false;
    }, 500);
    timeout_off_rotate_is_doed = true;
  }
}
function Game_over() {
  setTimeout( ()=>{location.reload(true) }, 1000);
}
function Debug_all_cards_in_console(){
  for (var i = 0; i < 10; i++) {
    console.log(cards[i]);
  }
}
function Set_card_values_all() {
  for (let i = 0; i < 10; i++) {
    let random_value = Card.Get_random_value_card_no_reiteration();
    if ( cards[i].second_card.card_value == "" ) {
      cards[i].Set_card_value(random_value);
      cards[i].second_card.Set_card_value(random_value);
    } else if (cards[i+1].second_card.card_value == "") {
      cards[i+1].Set_card_value(random_value);
      cards[i+1].second_card.Set_card_value(random_value);
    } else if (cards[i+2].second_card.card_value == "") {
      cards[i+2].Set_card_value(random_value);
      cards[i+2].second_card.Set_card_value(random_value);
    } else if (cards[i+3].second_card.card_value == "") {
      cards[i+3].Set_card_value(random_value);
      cards[i+3].second_card.Set_card_value(random_value);
    } else if (cards[i+4].second_card.card_value == "") {
      cards[i+4].Set_card_value(random_value);
      cards[i+4].second_card.Set_card_value(random_value);
    } else if (cards[i+5].second_card.card_value == "") {
      cards[i+5].Set_card_value(random_value);
      cards[i+5].second_card.Set_card_value(random_value);
    } else if (cards[i+6].second_card.card_value == "") {
      cards[i+6].Set_card_value(random_value);
      cards[i+6].second_card.Set_card_value(random_value);
    } else if (cards[i+7].second_card.card_value == "") {
      cards[i+7].Set_card_value(random_value);
      cards[i+7].second_card.Set_card_value(random_value);
    } else if (cards[i+8].second_card.card_value == "") {
      cards[i+8].Set_card_value(random_value);
      cards[i+8].second_card.Set_card_value(random_value);
    }else if (cards[i+9].second_card.card_value == "") {
      cards[i+9].Set_card_value(random_value);
      cards[i+9].second_card.Set_card_value(random_value);
    }
  }
}
function Update() {
  if ( motion_is_doed == true ) {
    End_of_motion();
  }
  if ( game_is_over == true ) {
    Game_over();
  }
  setTimeout(Update, 1000/fps);
}
function Start() {
  Init_cards();
  Set_second_cards_for_all();
  Set_card_values_all();
}

Start();
Update();
