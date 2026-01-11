
import { Card, Tile } from './types';

export const ROUTE_LENGTH = 12;
export const HOSPITAL_COST_MULTIPLIER = 500;
export const pColors = ["#f1c40f", "#3b82f6", "#ef4444", "#22c55e", "#d946ef", "#06b6d4", "#ec4899", "#8b5cf6"];
export const pIcons = ["🚀", "🦄", "🤖", "🍕", "👾", "🧙", "🕵️", "🎸", "🏆", "💎"];

export const mazoReto: Card[] = [
    { t: "Imita a alguien famoso (real o inventado). Si alguien lo adivina.", r: { happy: 2 }, i: "🎭", c: "bg-blue-100" },
    { t: "Haz reír a un jugador en 15 segundos. Si lo logras.", r: { happy: 1 }, i: "😂", c: "bg-blue-100" },
    { t: "Comienza a decir palabras con 'A'. Si logras decir 25 sin repetir.", r: { money: 5000 }, i: "🅰️", c: "bg-blue-100" },
    { t: "Baila 20 segundos como si ganaras un premio. Si el grupo aplaude.", r: { health: 2, happy: 2 }, i: "💃", c: "bg-blue-100" },
    { t: "Canta todo lo que digas hasta tu siguiente turno. Si lo haces.", r: { happy: 1 }, i: "🎵", c: "bg-blue-100" },
    { t: "Repite un trabalenguas que te diga otro jugador. Si lo logras.", r: { money: 3000 }, i: "🗣️", c: "bg-blue-100" },
    { t: "Haz una selfie con todos, si alguno no sonríe te paga 1 Felicidad.", r: { happy: 2 }, i: "📸", c: "bg-blue-100" },
    { t: "Piensa en algo verde y da 3 pistas. Si nadie lo adivina.", r: { money: 1000 }, i: "🟢", c: "bg-blue-100" },
    { t: "Haz una escena dramática. Si te aplauden.", r: { health: 2 }, i: "🎭", c: "bg-blue-100" },
    { t: "Inventa y di un producto ridículo pero útil. Si les gusta a la mitad.", r: { money: 3000 }, i: "💡", c: "bg-blue-100" },
    { t: "Tira un dado. Si es impar, todos te dan $1,000.", r: { money: 1000 }, i: "🎲", c: "bg-blue-100" },
    { t: "Simula una llamada a un manicomio. Si aguantan 30 seg sin reír.", r: { money: 2000 }, i: "📞", c: "bg-blue-100" },
    { t: "Crea un jingle de este juego. Si alguien más canta contigo.", r: { happy: 2 }, i: "🎶", c: "bg-blue-100" },
    { t: "Actúa como un animal que hace algo raro. Si haces reír.", r: { happy: 2 }, i: "🦄", c: "bg-blue-100" },
    { t: "Simula pedir una pizza de insectos y sé específico. Si lo haces bien.", r: { happy: 2 }, i: "🍕", c: "bg-blue-100" },
    { t: "Imita a un alien que da consejos sabios sobre uñas. Si alguien ríe.", r: { happy: 1 }, i: "👽", c: "bg-blue-100" },
    { t: "Solo sonríe 30 segundos sin parar.", r: { health: 2, happy: 2 }, i: "😁", c: "bg-blue-100" },
    { t: "Di 3 cosas que harías si fueras invisible. Si sorprendes.", r: { money: 3000 }, i: "👻", c: "bg-blue-100" },
    { t: "Inventa anuncio de bebida sabor pollo con plumas. Si alguien ríe.", r: { money: 1000 }, i: "🍗", c: "bg-blue-100" },
    { t: "Pide silencio, si logras que el grupo calle 10 seg.", r: { happy: 1 }, i: "🤫", c: "bg-blue-100" }
];

export const mazoExpertis: Card[] = [
    { t: "Haz una pausa de 10 segundos y respira profundo.", r: { health: 2 }, i: "🌬️", c: "bg-green-100" },
    { t: "Recuerda y cuenta una lección difícil de tu vida.", r: { money: 1000, health: 1, happy: 1 }, i: "📚", c: "bg-green-100" },
    { t: "Comparte con el grupo algo que te hizo fuerte.", r: { money: 1000, happy: 2 }, i: "💪", c: "bg-green-100" },
    { t: "Reflexiona en silencio 10 segundos sobre lo que más valoras.", r: { health: 2, happy: 1 }, i: "💭", c: "bg-green-100" },
    { t: "Párate frente a un espejo imaginario y di: 'Estoy avanzado'.", r: { health: 2, happy: 1 }, i: "🪞", c: "bg-green-100" },
    { t: "Platica a los demás de un libro que te cambió.", r: { money: 2000, happy: 2 }, i: "📖", c: "bg-green-100" },
    { t: "Simula que caminas por un bosque y cuenta qué sientes.", r: { health: 3 }, i: "🌲", c: "bg-green-100" },
    { t: "Da un consejo a un jugador menor que tú.", r: { happy: 1 }, i: "🤝", c: "bg-green-100" },
    { t: "Comenta de un error que cometiste y lo que aprendiste.", r: { health: 2 }, i: "📉", c: "bg-green-100" },
    { t: "Comenta un momento en que decidiste cambiar.", r: { money: 1000, health: 1, happy: 1 }, i: "🔄", c: "bg-green-100" },
    { t: "Cuéntale al grupo qué cosa maravillosa harás la siguiente semana.", r: { health: 2 }, i: "📅", c: "bg-green-100" },
    { t: "Finge que recibes un premio por ser el mejor escritor.", r: { money: 1000, happy: 1 }, i: "🏆", c: "bg-green-100" },
    { t: "Simula que estás grabando un podcast de motivación (30 seg).", r: { money: 3000, happy: 2 }, i: "🎙️", c: "bg-green-100" },
    { t: "Pregúntale a alguien: ¿Qué lo hace feliz?", r: { happy: 2 }, i: "❓", c: "bg-green-100" },
    { t: "Tienes que decirle a todos 3 metas para tu siguiente mes.", r: { health: 1, happy: 1 }, i: "🎯", c: "bg-green-100" },
    { t: "Canta un pedazo de una canción que te inspira.", r: { health: 1, happy: 1, money: 1000 }, i: "🎤", c: "bg-green-100" },
    { t: "Te toca reflexionar, quédate en silencio hasta que vuelvas a tirar.", r: { health: 2, happy: 2 }, i: "🤫", c: "bg-green-100" },
    { t: "Si puedes decir qué número de día es hoy sin ver tu celular.", r: { health: 2 }, i: "📆", c: "bg-green-100" },
    { t: "Toma agua y haz un brindis por tu progreso.", r: { health: 1, happy: 1 }, i: "🥛", c: "bg-green-100" },
    { t: "Finge y posa que te toman una foto de tu versión futura exitosa.", r: { happy: 2 }, i: "📸", c: "bg-green-100" }
];

export const mazoRutas: { [key: string]: Card[] } = {
    IMPACTO: [
        { t: "Pinta ahora mismo algo que te representa.", r: { happy: 4 }, i: "🎨" },
        { t: "Canta un pedazo de tu canción favorita.", r: { happy: 4, health: 2 }, i: "🎤" },
        { t: "Tomaste ayer una foto creativa. Descríbela.", r: { happy: 3 }, i: "📸" },
        { t: "Actúa como influencer motivacional.", r: { happy: 5, money: 3000 }, i: "📱" },
        { t: "Escribiste ya un microcuento brillante. Cuéntalo.", r: { happy: 3 }, i: "✍️" },
        { t: "Te plagian una idea.", r: { happy: -3, health: -2 }, i: "🚫" },
        { t: "Haz un baile divertido de 10 segundos.", r: { happy: 4, health: 3 }, i: "💃" },
        { t: "Publicaste un video inspirador. Descríbelo.", r: { happy: 4 }, i: "📹" },
        { t: "Diseñaste un logo para un amigo.", r: { happy: 2, money: 2000 }, i: "✏️" },
        { t: "Premio a la creatividad del mes.", r: { happy: 5 }, i: "🏆" }
    ],
    BIENESTAR: [
        { t: "Duermes 8 horas de calidad.", r: { health: 4, happy: 2 }, i: "😴" },
        { t: "Sesión de terapia efectiva.", r: { health: 4 }, i: "🛋️" },
        { t: "Entrenas con un amigo. Pídele que hagan juntos 3 sentadillas.", r: { health: 3 }, i: "🏋️" },
        { t: "Comes sano 3 días seguidos.", r: { health: 4 }, i: "🥗" },
        { t: "Te felicitan por tu cambio positivo.", r: { happy: 3 }, i: "👏" },
        { t: "Te lesionas entrenando.", r: { health: -5 }, i: "🤕" },
        { t: "Día de spa y relajación profunda.", r: { health: 4, happy: 3 }, i: "🧖" },
        { t: "Meditas 5 minutos en silencio.", r: { health: 4 }, i: "🧘" },
        { t: "Apagaste el celular 30 min. todos los días.", r: { health: 3, happy: 2 }, i: "📵" },
        { t: "Decides tomar un smoothie verde poderoso.", r: { health: 2 }, i: "🥤" }
    ],
    CARRERA:[
        {t:"Consigues tu primer empleo.",r:{money:4000},i:"👔"},
        {t:"Tu jefe te reconoce públicamente.",r:{happy:4},i:"🤝"},
        {t:"Llegas tarde a una reunión clave.",r:{money:-2000,happy:-2},i:"⏰"},
        {t:"Te ascienden a coordinador.",r:{money:6000},i:"📈"},
        {t:"Recorte de personal: te despiden.",r:{money:-6000,happy:-3},i:"📦"},
        {t:"Cierras un gran contrato.",r:{money:8000},i:"✍️"},
        {t:"Horas extra sin pago.",r:{happy:-3},i:"😫"},
        {t:"Eres el empleado del mes.",r:{happy:4,health:2},i:"🏅"},
        {t:"Error con un cliente importante.",r:{money:-2000,happy:-2},i:"❌"},
        {t:"Tu equipo logra un objetivo clave.",r:{money:4000,happy:3},i:"🎯"}
    ],
    ESPIRITU:[
        {t:"Prototipas tu primer producto.",r:{money:4000},i:"🛠️"},
        {t:"Tu inventario llega tarde.",r:{money:-2000,happy:-2},i:"🚚"},
        {t:"Abres tu primera tienda/pop-up.",r:{money:6000},i:"🏪"},
        {t:"Haces tu primer reel de anuncio.",r:{money:4000},i:"📱"},
        {t:"Te critican en redes.",r:{happy:-3,health:-1},i:"👎"},
        {t:"Cierra una venta gigante.",r:{money:8000},i:"💲"},
        {t:"Bloqueo financiero: te quedas sin liquidez.",r:{money:-3000},i:"💸"},
        {t:"Delegas como pro tus actividades.",r:{money:4000,health:3},i:"👥"},
        {t:"Cliente satisfecho te recomienda.",r:{happy:4},i:"🗣️"},
        {t:"Lanzas un nuevo servicio.",r:{money:4000,happy:2},i:"🆕"}
    ],
    FORMACION:[
        {t:"Te inscribes a un curso intensivo.",r:{happy:4,money:2000},i:"📚"},
        {t:"Celebra que terminaste tu diplomado con honores.",r:{happy:6},i:"🎓"},
        {t:"Dinos un libro que te cambió la perspectiva.",r:{happy:2},i:"📖"},
        {t:"Aprendes un idioma nuevo.",r:{happy:4},i:"🗣️"},
        {t:"Te presentas en público por primera vez.",r:{happy:4},i:"🎤"},
        {t:"Obtienes una beca educativa.",r:{money:4000},i:"📝"},
        {t:"Das una clase virtual.",r:{happy:6},i:"💻"},
        {t:"Te gradúas como coach certificado.",r:{happy:4,money:4000},i:"🏅"},
        {t:"Cuenta qué hace la nueva app que programaste.",r:{money:4000},i:"📱"},
        {t:"Tomaste un curso de finanzas.",r:{money:2000,happy:2},i:"💹"}
    ],
    INVERSION:[
        {t:"Cripto al alza: tomas ganancia.",r:{money:6000},i:"🚀"},
        {t:"Cripto a la baja: caes con mercado.",r:{money:-4000},i:"📉"},
        {t:"Recibes dividendos extraordinarios.",r:{money:6000},i:"💵"},
        {t:"La burbuja explota: pérdida total.",r:{money:-5000},i:"💥"},
        {t:"Compras un piso para renta.",r:{passive:2000},i:"🏢"},
        {t:"Un podcast financiero te ilumina.",r:{happy:3,health:2},i:"🎧"},
        {t:"Interés compuesto a tu favor.",r:{money:4000},i:"🔄"},
        {t:"Inviertes en algo ilegal sin saber.",r:{money:-4000,happy:-3},i:"🚔"},
        {t:"Vendes antes de la crisis.",r:{money:8000},i:"🛑"},
        {t:"Compras acciones y suben fuerte.",r:{money:6000},i:"📈"}
    ],
    LIBERTAD:[
        {t:"Logras la independencia económica.",r:{money:15000},i:"🔓"},
        {t:"Vives de tus rentas.",r:{money:6000,health:2},i:"🏖️"},
        {t:"Tomas vacaciones sin preocuparte.",r:{happy:5,health:2},i:"🌴"},
        {t:"Cubres gastos sin trabajar.",r:{passive:4000,happy:3},i:"💳"},
        {t:"Automatizas tus ingresos.",r:{passive:2000},i:"⚙️"},
        {t:"Inviertes en propiedades de lujo y aciertas.",r:{money:6000},i:"🏰"},
        {t:"Pagas todas tus deudas.",r:{happy:5,health:3},i:"✂️"},
        {t:"Compras tu casa de ensueño.",r:{happy:5},i:"🏡"},
        {t:"Trabajas solo por gusto.",r:{happy:4,health:2},i:"❤️"},
        {t:"Lograste tu semana ideal.",r:{happy:4},i:"📅"}
    ],
    LIDERAZGO:[
        {t:"Tomas el rol de líder.",r:{happy:4,health:3},i:"👑"},
        {t:"Da una charla que inspira de al menos 1 minuto.",r:{happy:5},i:"🗣️"},
        {t:"Dale un consejo a otro jugador.",r:{happy:3},i:"👯"},
        {t:"Te gradúas como mentor.",r:{happy:4,money:4000},i:"🎓"},
        {t:"Pídele a algún jugador que te dé una crítica tuya.",r:{happy:-2,money:2000},i:"📉"},
        {t:"Reconoce públicamente a tus amigos.",r:{happy:4},i:"🏆"},
        {t:"Delegas con maestría.",r:{money:4000,health:2},i:"🧩"},
        {t:"Diseñas un plan estratégico ganador.",r:{money:6000},i:"🗺️"},
        {t:"Enseñas a un niño algo valioso.",r:{happy:4},i:"👶"},
        {t:"Gestionaste una crisis con calma.",r:{happy:3,health:2},i:"🔥"}
    ]
};
export const routeCosts: { [key: string]: number } = { IMPACTO: 1000, BIENESTAR: 1000, CARRERA: 3000, ESPIRITU: 3000, FORMACION: 3000, INVERSION: 4000, LIBERTAD: 2000, LIDERAZGO: 2000 };

export const mainBoard: Tile[] = [
    { n: "Inicio", t: "ESQUINA", d: "Cobra Ingreso Pasivo", i: "🏠" },
    { n: "Expertis", t: "CARTA", c: "EXPERTIS", d: "Toma una carta de 'Expertis'", i: "🧠" },
    { n: "Día de Spa", t: "RELAX", d: "No pasa nada. Relájate.", i: "🧖" },
    { n: "Reto", t: "CARTA", c: "RETO", d: "Toma una carta de 'Oportunidad'", i: "⚡" },
    { n: "Formación", t: "ENTRADA", r: "FORMACION", d: "Entra a la ruta de Formación", i: "🎓" },
    { n: "Restaurante", t: "DADO_EVENTO", d: "Te toca pagar la cuenta. Tira dado: Paga $1,000 x punto.", i: "🍽️" },
    { n: "Expertis", t: "CARTA", c: "EXPERTIS", d: "Toma una carta de 'Expertis'", i: "🧠" },
    { n: "Carrera Corp", t: "ENTRADA", r: "CARRERA", d: "Entra a la ruta de Carrera Corporativa", i: "💼" },
    { n: "Reto", t: "CARTA", c: "RETO", d: "Toma una carta de 'Oportunidad'", i: "⚡" },
    { n: "Causa Social", t: "DADO_EVENTO", d: "Tira dado: Ganas $1,000 x punto y donas.", i: "🤝" },
    { n: "SUERTE", t: "ESQUINA", d: "Te llevas el Pozo acumulado.", i: "🍀" },
    { n: "Todos Donan", t: "MULTA", a: 1000, d: "Todos donan $1,000 al Pozo.", global: true, i: "🤲" },
    { n: "Expertis", t: "CARTA", c: "EXPERTIS", d: "Toma una carta de 'Expertis'", i: "🧠" },
    { n: "Contaminación", t: "DADO_EVENTO", d: "Riesgo de enfermedad. Tira dado: Pierdes 1 Salud x punto.", i: "😷" },
    { n: "Espíritu Emprendedor", t: "ENTRADA", r: "ESPIRITU", d: "Entra a la ruta de Espíritu Emprendedor", i: "💡" },
    { n: "Demanda", t: "DADO_EVENTO", d: "Paga $1,000 x punto del dado", i: "⚖️" },
    { n: "Reto", t: "CARTA", c: "RETO", d: "Toma una carta de 'Oportunidad'", i: "⚡" },
    { n: "Inversión Inteligente", t: "ENTRADA", r: "INVERSION", d: "Entra a la ruta de Inversión", i: "📈" },
    { n: "Día de Suerte", t: "BONUS", a: 0, d: "El jugador de tu derecha te regala 1 de felicidad y 1 de salud.", i: "😊" },
    { n: "Expertis", t: "CARTA", c: "EXPERTIS", d: "Toma una carta de 'Expertis'", i: "🧠" },
    { n: "VACACIONES", t: "ESQUINA", d: "Tira Dado. Pagas $1,000 por punto y ganas 1 Felicidad por punto.", i: "🏖️" },
    { n: "Expertis", t: "CARTA", c: "EXPERTIS", d: "Toma una carta de 'Expertis'", i: "🧠" },
    { n: "Ganaste", t: "BONUS", a: 2000, d: "Suma $2,000 a tu ingreso pasivo.", i: "🏆" },
    { n: "Casino", t: "DADO_EVENTO", d: "Paga $1,000 y pierde 1 de felicidad por punto.", i: "🎰" },
    { n: "Bienestar Integral", t: "ENTRADA", r: "BIENESTAR", d: "Entra a la ruta de Bienestar", i: "🧘" },
    { n: "Reto", t: "CARTA", c: "RETO", d: "Toma una carta de 'Oportunidad'", i: "⚡" },
    { n: "Recita un Poema", t: "BONUS", a: 0, d: "Si te aplauden, todos ganan +3 felicidad O +3 salud.", i: "📜" },
    { n: "Impacto Creativo", t: "ENTRADA", r: "IMPACTO", d: "Entra a la ruta de Impacto Creativo", i: "🎨" },
    { n: "Expertis", t: "CARTA", c: "EXPERTIS", d: "Toma una carta de 'Expertis'", i: "🧠" },
    { n: "Relax", t: "RELAX", d: "No pasa nada. Relájate.", i: "😌" },
    { n: "HOSPITAL", t: "ESQUINA", d: "Tira dado: Paga $1,000 por punto y gana 1 Salud por punto.", i: "🏥" },
    { n: "Familia", t: "DADO_EVENTO", d: "Convives en familia. Tira dado: Ganas $1,000 y 1 Salud por punto.", i: "👨‍👩‍👧" },
    { n: "Reto", t: "CARTA", c: "RETO", d: "Toma una carta de 'Oportunidad'", i: "⚡" },
    { n: "Impuestos", t: "DADO_EVENTO", d: "Tira 1 dado: Paga $1,000 x punto.", i: "💸" },
    { n: "Liderazgo Mentoría", t: "ENTRADA", r: "LIDERAZGO", d: "Entra a la ruta de Liderazgo", i: "👑" },
    { n: "Alerta Pandemia", t: "DADO_EVENTO", d: "Virus nuevo. Tira dado: Pierde 1 Salud x punto.", i: "🦠" },
    { n: "Expertis", t: "CARTA", c: "EXPERTIS", d: "Toma una carta de 'Expertis'", i: "🧠" },
    { n: "Libertad Financiera", t: "ENTRADA", r: "LIBERTAD", d: "Entra a la ruta de Libertad Financiera", i: "🏝️" },
    { n: "Reto", t: "CARTA", c: "RETO", d: "Toma una carta de 'Oportunidad'", i: "⚡" },
    { n: "Feliz Cumpleaños", t: "BONUS", a: 1000, d: "Todos los jugadores te regalan $1,000.", i: "🎂" },
];

export const innerRouteTiles = [35, 36, 37, 38, 39, 40, 51, 62, 73, 84, 83, 82];