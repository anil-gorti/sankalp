import { db } from "./db";
import { songs } from "@shared/schema";
import { sql } from "drizzle-orm";

const SEED_SONGS = [
  {
    recipientName: "कमला",
    recipientRelation: "mother",
    occasion: "daily_blessing",
    deity: "ganesh",
    language: "hindi_classical",
    userSankalp: "माँ की सेहत हमेशा अच्छी रहे",
    generatedLyrics: `[पल्लवी / PALLAVI]
हे गणपति बप्पा, कमला माँ को आशीर्वाद दो,
सदा स्वस्थ रहें, सदा प्रसन्न रहें, यही वरदान दो।

[अंतरा १ / ANTRA 1]
हर सुबह नई किरण लाए उनके जीवन में,
हर शाम शांति का दीप जले उनके आँगन में,
गणराज की कृपा बरसे उन पर सदा,
माँ के चरणों में फूल खिलें हर घड़ी सदा।

[पल्लवी / PALLAVI]
हे गणपति बप्पा, कमला माँ को आशीर्वाद दो,
सदा स्वस्थ रहें, सदा प्रसन्न रहें, यही वरदान दो।

[अंतरा २ / ANTRA 2]
उनकी सेहत का रखना ध्यान हे देवा,
हर बीमारी से बचाना, करना सेवा,
माँ की हँसी में बसता है सारा संसार,
गणपति विघ्नहर्ता, करो उनका उद्धार।

[पल्लवी - समापन / PALLAVI - CLOSING]
हे गणपति बप्पा, कमला माँ को आशीर्वाद दो,
सदा स्वस्थ रहें, सदा प्रसन्न रहें, यही वरदान दो।
गणपति बप्पा मोरया, मंगल मूर्ति मोरया!`,
    status: "completed",
  },
  {
    recipientName: "राहुल",
    recipientRelation: "child",
    occasion: "exam_success",
    deity: "hanuman",
    language: "hindi_classical",
    userSankalp: "बेटे की परीक्षा अच्छी हो",
    generatedLyrics: `[पल्लवी / PALLAVI]
जय हनुमान, राहुल को विद्या का वरदान दो,
परीक्षा में सफलता मिले, बुद्धि और ज्ञान दो।

[अंतरा १ / ANTRA 1]
संकट मोचन हनुमान, कीजे कृपा अपार,
विद्या की देवी सरस्वती का करो साक्षात्कार,
हर प्रश्न का उत्तर मिले आसानी से,
मन में विश्वास जगे, दूर हो उदासी से।

[पल्लवी / PALLAVI]
जय हनुमान, राहुल को विद्या का वरदान दो,
परीक्षा में सफलता मिले, बुद्धि और ज्ञान दो।

[अंतरा २ / ANTRA 2]
बजरंगबली की कृपा से हर मुश्किल हो आसान,
परीक्षा का भय मिटे, मिले अच्छे अंक महान,
बेटे की मेहनत रंग लाए हे पवनसुत,
राहुल की सफलता का गाएं सब मिलकर गीत।

[पल्लवी - समापन / PALLAVI - CLOSING]
जय हनुमान, राहुल को विद्या का वरदान दो,
परीक्षा में सफलता मिले, बुद्धि और ज्ञान दो।
जय श्री राम, जय हनुमान!`,
    status: "completed",
  },
  {
    recipientName: "प्रिया",
    recipientRelation: "spouse",
    occasion: "festival",
    deity: "krishna",
    language: "hindi_classical",
    userSankalp: "दिवाली पर पत्नी के लिए शुभकामनाएं",
    generatedLyrics: `[पल्लवी / PALLAVI]
हे कृष्ण मुरारी, प्रिया को खुशियों का उपहार दो,
दिवाली की इस बेला में, प्रेम का संसार दो।

[अंतरा १ / ANTRA 1]
दीपों की माला सजी है आँगन में आज,
प्रिया के चेहरे पर चमके खुशी का ताज,
मुरली की धुन पर नाचे खुशी का मेला,
त्योहार का यह पावन समय, सुनहरा सवेरा।

[पल्लवी / PALLAVI]
हे कृष्ण मुरारी, प्रिया को खुशियों का उपहार दो,
दिवाली की इस बेला में, प्रेम का संसार दो।

[अंतरा २ / ANTRA 2]
हर दिवाली लाए नई खुशी का सवेरा,
प्रिया के जीवन से मिटे हर अँधेरा,
गोविंद की कृपा से भरा रहे संसार,
पति-पत्नी का प्रेम रहे अमर, अपार।

[पल्लवी - समापन / PALLAVI - CLOSING]
हे कृष्ण मुरारी, प्रिया को खुशियों का उपहार दो,
दिवाली की इस बेला में, प्रेम का संसार दो।
राधे राधे, श्याम मिलन!`,
    status: "completed",
  },
];

export async function seedDatabase() {
  try {
    const existing = await db.select({ count: sql<number>`count(*)` }).from(songs);
    const count = Number(existing[0]?.count || 0);

    if (count === 0) {
      for (const song of SEED_SONGS) {
        await db.insert(songs).values(song);
      }
      console.log(`Seeded ${SEED_SONGS.length} example songs`);
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}
