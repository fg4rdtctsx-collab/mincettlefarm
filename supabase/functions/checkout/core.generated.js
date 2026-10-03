// Generated from the existing checkout engine. Do not edit.
import process from "node:process";

// src/lib/checkout.ts
import { randomUUID } from "node:crypto";
import { db, checkoutInventory, checkoutOrders } from "@workspace/db";
import { and, eq, sql } from "drizzle-orm";

// ../mini-cattle-farm/src/data/catalog.json
var catalog_default = {
  products: [
    {
      id: 16917,
      slug: "ace",
      name: "Ace",
      description: "Meet Ace \u2013 Adorable 3-Month-Old Male Mini Highland Cow\n\n\nMeet Ace, a handsome 3-month-old male Mini Highland Cow with a fluffy coat, sweet expression, and distinctive Highland features.\n\n\nAce is a charming young calf with plenty of character and an adorable appearance. At just three months old, he is growing beautifully and would make a wonderful addition to a suitable farm, homestead, hobby farm, or Mini Highland cattle herd.\n\n\n\u{1F42E} Ace at a Glance\n\n\n\nName: Ace\n\n\nAge: 3 months old\n\n\nGender: Male\n\n\nBreed: Mini Highland Cow\n\n\nType: Male Mini Highland calf\n\n\nAppearance: Fluffy coat and classic Highland features\n\n\n\nAce\u2019s adorable face and fluffy Highland appearance make him especially appealing to anyone who loves Mini Highland cattle and miniature Highland calves.\n\n\nIf you\u2019re searching for a male Mini Highland Cow for sale, 3-month-old Highland calf, Mini Highland calf, miniature Highland cattle, fluffy Highland calf, or young Mini Highland Cow, Ace is a wonderful young calf to consider.\n\n\nContact us today to learn more about Ace and his availability.\n\n\nMini Highland Cow for sale, male Mini Highland Cow, Ace Mini Highland Cow, 3-month-old Highland calf, male Highland calf, Mini Highland calf, miniature Highland cattle, fluffy Highland calf, Mini Highland cattle for sale, Highland cattle for sale, male Mini Highland calf, young Mini Highland Cow.",
      shortDescription: "",
      price: 850,
      regularPrice: 1500,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 19,
          name: "Highland Cows",
          slug: "highland-cows"
        }
      ],
      images: [
        "/family-assets/fghjk.jpg",
        "/family-assets/fghjk.jpg",
        "/family-assets/juytrtyhjk.jpg",
        "/family-assets/rtyui.jpg"
      ]
    },
    {
      id: 16905,
      slug: "hazel",
      name: "Hazel",
      description: "Meet Hazel \u2013 Adorable 3-Month-Old Female Mini Highland Cow\n\n\nMeet Hazel, a beautiful 3-month-old female Mini Highland Cow with an adorable fluffy coat, sweet expression, and the distinctive Highland look that makes these cattle so special.\n\n\nHazel is a charming young heifer with plenty of personality and a lovely appearance. At just three months old, she is at a delightful stage of growth and would make a wonderful addition to a suitable farm, homestead, hobby farm, or Mini Highland cattle herd.\n\n\n\u{1F42E} Hazel at a Glance\n\n\n\nName: Hazel\n\n\nAge: 3 months old\n\n\nGender: Female\n\n\nBreed: Mini Highland Cow\n\n\nType: Female Mini Highland calf / young heifer\n\n\nAppearance: Fluffy coat and classic Highland features\n\n\n\nHazel\u2019s sweet face and fluffy Highland appearance make her especially appealing to anyone who loves Mini Highland cattle and miniature Highland calves.\n\n\nIf you\u2019re searching for a female Mini Highland Cow for sale, 3-month-old Highland calf, Mini Highland heifer, miniature Highland cattle, fluffy Highland calf, or young Mini Highland Cow, Hazel is a lovely young heifer to consider.\n\n\nContact us today to learn more about Hazel and her availability.\n\n\nMini Highland Cow for sale, female Mini Highland Cow, Hazel Mini Highland Cow, 3-month-old Highland calf, female Highland calf, Mini Highland heifer, miniature Highland cattle, Mini Highland calf, fluffy Highland calf, Mini Highland cattle for sale, Highland cattle for sale, female Mini Highland calf, young Mini Highland Cow.",
      shortDescription: "",
      price: 900,
      regularPrice: 2500,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 19,
          name: "Highland Cows",
          slug: "highland-cows"
        }
      ],
      images: [
        "/family-assets/778565330_122107277163291885_4815396404788880099_n.jpg",
        "/family-assets/778565330_122107277163291885_4815396404788880099_n.jpg",
        "/family-assets/iuytrerty.jpg",
        "/family-assets/rtghj.jpg",
        "/family-assets/ytrty.jpg"
      ]
    },
    {
      id: 16897,
      slug: "daizy",
      name: "Daizy",
      description: "Here\u2019s a polished, warm, and SEO-friendly website description for Daizy:\n\n\nMeet Daizy \u2013 Adorable 4-Month-Old Female Mini Highland Cow\n\n\nMeet Daizy, a beautiful 4-month-old female Mini Highland Cow with a fluffy coat, sweet expression, and the charming Highland appearance that makes these cattle so special.\n\n\nDaizy is a lovely young heifer with a gentle-looking personality and plenty of character. At four months old, she is growing beautifully and would make a wonderful addition to a suitable farm, homestead, hobby farm, or Mini Highland cattle herd.\n\n\n\u{1F42E} Daizy at a Glance\n\n\n\nName: Daizy\n\n\nAge: 4 months old\n\n\nGender: Female\n\n\nBreed: Mini Highland Cow\n\n\nType: Female Mini Highland calf / young heifer\n\n\nAppearance: Fluffy coat and distinctive Highland features\n\n\n\nIf you\u2019re searching for a female Mini Highland Cow for sale, 4-month-old Highland calf, Mini Highland heifer, miniature Highland cattle, or fluffy Highland calf, Daizy is a charming young heifer to consider.\n\n\nContact us today to learn more about Daizy and her availability\n\n\nMini Highland Cow for sale, female Mini Highland Cow, Daizy Mini Highland Cow, 4-month-old Highland calf, female Highland calf, Mini Highland heifer, miniature Highland cattle, Mini Highland calf, fluffy Highland calf, Mini Highland cattle for sale, Highland cattle for sale, female Mini Highland calf.",
      shortDescription: "",
      price: 950,
      regularPrice: 2e3,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 19,
          name: "Highland Cows",
          slug: "highland-cows"
        }
      ],
      images: [
        "/family-assets/lkiugfdfghj.jpg",
        "/family-assets/818365298_122112869835291885_5476961273451055053_n.jpg",
        "/family-assets/jy.jpg",
        "/family-assets/lkiugfdfghj.jpg",
        "/family-assets/trert.jpg"
      ]
    },
    {
      id: 16873,
      slug: "gabby",
      name: "Gabby",
      description: "Gabby\u{1F42E}\n\n\nGabby is an adorable 3-month-old Mini Highland Cow with a fluffy coat, sweet face, and charming Highland appearance. This young calf is full of personality and would make a wonderful addition to a suitable farm, homestead, or hobby farm.\n\n\nIf you\u2019re searching for a Mini Highland Cow for sale, 3-month-old Highland calf, Mini Highland calf, miniature Highland cattle, or fluffy Highland cow, gabby is a lovely calf to consider.\n\n\nContact us today to learn more about Gabby and availability.\n\n\nMini Highland Cow for sale, Gabby Mini Highland Cow, 3-month-old Highland calf, Mini Highland calf, miniature Highland cattle, fluffy Highland calf, Mini Highland cattle for sale, Highland calf for sale.",
      shortDescription: "",
      price: 850,
      regularPrice: 1500,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 19,
          name: "Highland Cows",
          slug: "highland-cows"
        }
      ],
      images: [
        "/family-assets/kiuhgfghj.jpg",
        "/family-assets/kiuhgfghj.jpg",
        "/family-assets/ghjklkjhg.jpg",
        "/family-assets/ghjkjh.jpg",
        "/family-assets/4567ty.jpg",
        "/family-assets/ghjkjhg.jpg",
        "/family-assets/793204042_122125653243341414_1288450142830631690_n.jpg",
        "/family-assets/798041897_122125653135341414_8367564593050338176_n.jpg"
      ]
    },
    {
      id: 16861,
      slug: "maisie",
      name: "Maisie",
      description: "Meet Maisie \u2013 Adorable 2-Month-Old Female Nigerian Dwarf Goat\n\n\nMeet Maisie, a sweet and adorable 2-month-old female Nigerian Dwarf goat with a charming personality and the petite size that makes this breed so popular with goat lovers.\n\n\nMaisie is a lovely young doeling with an endearing appearance and plenty of personality. At just two months old, she is at a delightful stage of growth and is sure to bring joy and character to the right farm, homestead, hobby farm, or small goat herd.\n\n\n\u{1F410} Maisie at a Glance\n\n\n\nName: Maisie\n\n\nAge: 2 months old\n\n\nGender: Female\n\n\nBreed: Nigerian Dwarf Goat\n\n\nType: Female Nigerian Dwarf doeling\n\n\nPersonality: Sweet, playful, and charming\n\n\nIdeal for: Hobby farms, homesteads, small farms, and goat enthusiasts\n\n\n\nNigerian Dwarf goats are loved for their small stature, friendly nature, and adorable appearance. Maisie is a wonderful young example of this popular miniature goat breed and would make a charming addition to a suitable home or small herd.\n\n\nIf you\u2019ve been searching for a Nigerian Dwarf goat for sale, female Nigerian Dwarf goat, 2-month-old Nigerian Dwarf goat, Nigerian Dwarf doeling, miniature goat, or baby Nigerian Dwarf goat, Maisie is a lovely young goat to consider.\n\n\nContact us today to learn more about Maisie and her availability.\n\n\nNigerian Dwarf goat for sale, female Nigerian Dwarf goat, Maisie Nigerian Dwarf goat, 2-month-old Nigerian Dwarf goat, Nigerian Dwarf doeling, baby Nigerian Dwarf goat, miniature goat for sale, Nigerian Dwarf goats for sale, female Dwarf goat, young Nigerian Dwarf goat, Nigerian Dwarf baby goat, small goat breed, Nigerian Dwarf doeling for sale.",
      shortDescription: "",
      price: 200,
      regularPrice: 350,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 185,
          name: "Nigeria Dwarf Goat",
          slug: "nigeria-dwarf-goat"
        }
      ],
      images: [
        "/family-assets/9.jpg",
        "/family-assets/9.jpg",
        "/family-assets/10.jpg",
        "/family-assets/11.jpg",
        "/family-assets/12.jpg"
      ]
    },
    {
      id: 16853,
      slug: "bonnie",
      name: "Bonnie",
      description: "Meet Bonnie \u2013 Adorable 2-Month-Old Mini Highland Cow\n\n\nMeet Bonnie, a beautiful 2-month-old Mini Highland Cow with an adorable fluffy appearance, sweet expression, and the distinctive Highland look that makes these cattle so special.\n\n\nBonnie is a charming young calf with plenty of character and an irresistibly cute appearance. At just two months old, Bonnie is at a wonderful early stage of growth and is sure to capture the hearts of Highland cattle lovers.\n\n\nWith a fluffy coat, adorable face, and classic Highland features, Bonnie would make a wonderful addition to a suitable farm, homestead, hobby farm, or miniature cattle collection.\n\n\n\u{1F42E} Bonnie at a Glance\n\n\n\nName: Bonnie\n\n\nAge: 2 months old\n\n\nBreed: Mini Highland Cow\n\n\nType: Mini Highland calf\n\n\nAppearance: Fluffy coat and distinctive Highland features\n\n\nIdeal for: Hobby farms, small farms, homesteads, and Highland cattle enthusiasts\n\n\n\nBonnie is a lovely choice for anyone searching for a young Mini Highland calf with the classic charm and appearance of Highland cattle. This adorable calf is sure to become a cherished addition to the right home.\n\n\nIf you\u2019re searching for a Mini Highland Cow for sale, 2-month-old Highland calf, Mini Highland calf, miniature Highland cattle, fluffy Highland calf, or young Highland cow, Bonnie is a wonderful calf to consider.\n\n\nContact us today to learn more about Bonnie and her availability.\n\n\nMini Highland Cow for sale, Bonnie Mini Highland Cow, 2-month-old Highland calf, Mini Highland calf, miniature Highland cattle, fluffy Highland calf, Mini Highland cattle for sale, Highland cattle for sale, young Mini Highland Cow, miniature Highland cow, fluffy Mini Highland Cow, Highland calf for sale, Mini Highland calf for sale.",
      shortDescription: "",
      price: 800,
      regularPrice: 1500,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 19,
          name: "Highland Cows",
          slug: "highland-cows"
        }
      ],
      images: [
        "/family-assets/6.jpg",
        "/family-assets/5.jpg",
        "/family-assets/6.jpg",
        "/family-assets/7.jpg",
        "/family-assets/8.jpg"
      ]
    },
    {
      id: 16845,
      slug: "willow-2",
      name: "Willow",
      description: "Meet Willow \u2013 Adorable 4-Month-Old Male Mini Highland Cow\n\n\nMeet Willow, a charming 4-month-old male Mini Highland Cow with a beautiful fluffy coat, sweet expression, and the distinctive Highland appearance that makes these cattle so special.\n\n\nWillow is a lovely young calf with plenty of personality and an adorable look. At four months old, he is growing beautifully and showing the classic features that Highland cattle enthusiasts admire, including his fluffy coat and distinctive appearance.\n\n\n\u{1F42E} Willow at a Glance\n\n\n\nName: Willow\n\n\nAge: 4 months old\n\n\nGender: Male\n\n\nBreed: Mini Highland Cow\n\n\nType: Male Mini Highland calf\n\n\nAppearance: Fluffy coat and classic Highland features\n\n\nIdeal for: Hobby farms, small farms, homesteads, and Highland cattle enthusiasts\n\n\n\nWillow would make a wonderful addition to a suitable farm or homestead. His charming appearance and lovable Highland look make him a standout young calf for anyone who appreciates Mini Highland cattle.\n\n\nIf you have been searching for a male Mini Highland Cow for sale, 4-month-old Highland calf, Mini Highland calf, fluffy Highland calf, miniature Highland cattle, or male Highland calf, Willow is a beautiful young calf to consider.\n\n\nContact us today to learn more about Willow and his availability.\n\n\nMini Highland Cow for sale, male Mini Highland Cow, Willow Mini Highland Cow, 4-month-old Highland calf, male Highland calf, Mini Highland calf, miniature Highland cattle, fluffy Highland calf, Mini Highland cattle for sale, Highland cattle for sale, male Mini Highland calf, miniature Highland cow, fluffy Mini Highland Cow.",
      shortDescription: "",
      price: 800,
      regularPrice: 1500,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 19,
          name: "Highland Cows",
          slug: "highland-cows"
        }
      ],
      images: [
        "/family-assets/ert5678yui.jpg",
        "/family-assets/ert5678yui.jpg",
        "/family-assets/ertwertyertyuertyui.jpg",
        "/family-assets/grtytyrtyu.jpg",
        "/family-assets/tyertytyutyutyu.jpg"
      ]
    },
    {
      id: 16836,
      slug: "milla-and-millo",
      name: "milla and millo",
      description: "Meet Millo & Mella \u2013 Adorable 5-Month-Old Male Mini Highland Cows\n\n\nMeet Millo and Mella, two charming 5-month-old male Mini Highland Cows with beautiful fluffy coats, sweet faces, and the distinctive Highland appearance that makes these cattle so special.\n\n\nThese handsome young calves are full of character and have the adorable look that Highland cattle enthusiasts love. At five months old, Millo and Mella are growing beautifully and are wonderful examples of the charm and unique appearance of Mini Highland cattle.\n\n\n\u{1F42E} Millo & Mella at a Glance\n\n\n\nNames: Millo & Mella\n\n\nAge: 5 months old\n\n\nGender: Male\n\n\nBreed: Mini Highland Cow\n\n\nType: Male Mini Highland calves\n\n\nAppearance: Fluffy coats and distinctive Highland features\n\n\nIdeal for: Hobby farms, small farms, homesteads, and Highland cattle enthusiasts\n\n\n\nMillo and Mella would make wonderful additions to a suitable farm or homestead. Their fluffy appearance, charming expressions, and classic Highland features make them especially appealing to anyone who loves miniature cattle and Highland calves.\n\n\nIf you\u2019re searching for male Mini Highland Cows for sale, 5-month-old Highland calves, Mini Highland calves, miniature Highland cattle, fluffy Highland calves, or male Highland cattle, Millo and Mella are two lovely young calves to consider.\n\n\nContact us today to learn more about Millo and Mella and their availability.\n\n\nMini Highland Cow for sale, male Mini Highland Cow, Millo Mini Highland Cow, Mella Mini Highland Cow, 5-month-old Highland calf, male Highland calf, Mini Highland calves, miniature Highland cattle, fluffy Highland calf, Mini Highland cattle for sale, Highland cattle for sale, male Mini Highland calf, miniature Highland cow, fluffy Mini Highland Cow.\n\n\nIf Millo and Mella are twins, I can also make the description specifically about 5-month-old Mini Highland twin calves and include twin-related SEO keywords.",
      shortDescription: "",
      price: 1800,
      regularPrice: 3e3,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 19,
          name: "Highland Cows",
          slug: "highland-cows"
        }
      ],
      images: [
        "/family-assets/rtyui.jpg",
        "/family-assets/fghjkl.jpg",
        "/family-assets/rtyui.jpg",
        "/family-assets/edfghjk.jpg",
        "/family-assets/ertyui.jpg"
      ]
    },
    {
      id: 16828,
      slug: "muffin",
      name: "muffin",
      description: "Meet Muffin \u2013 Adorable 4-Month-Old Male Mini Highland Cow\n\n\nMeet Muffin, a handsome and lovable 4-month-old male Mini Highland Cow with a fluffy coat, sweet expression, and the distinctive Highland appearance that makes these cattle so special.\n\n\nMuffin is a charming young calf with a gentle-looking personality and plenty of character. At four months old, he is growing beautifully and has that irresistible combination of a fluffy coat, adorable face, and classic Highland features.\n\n\n\u{1F42E} Muffin at a Glance\n\n\n\nName: Muffin\n\n\nAge: 4 months old\n\n\nGender: Male\n\n\nBreed: Mini Highland Cow\n\n\nType: Male Mini Highland calf\n\n\nAppearance: Fluffy coat and distinctive Highland features\n\n\nIdeal for: Hobby farms, small farms, homesteads, and Highland cattle enthusiasts\n\n\n\nMuffin would make a charming addition to a suitable farm or homestead. His adorable appearance and unique Highland look make him especially appealing to anyone who loves Mini Highland cattle and fluffy Highland calves.\n\n\nIf you\u2019ve been searching for a male Mini Highland Cow for sale, 4-month-old Highland calf, Mini Highland calf, miniature Highland cattle, fluffy Highland cow, or male Highland calf, Muffin is a wonderful young calf to consider.\n\n\nContact us today to learn more about Muffin and his availability.\n\n\nMini Highland Cow for sale, male Mini Highland Cow, Muffin Mini Highland Cow, 4-month-old Highland calf, male Highland calf, Mini Highland calf, miniature Highland cattle, fluffy Highland calf, Mini Highland cattle for sale, Highland cattle for sale, male Mini Highland calf, miniature Highland cow, fluffy Mini Highland Cow.",
      shortDescription: "",
      price: 850,
      regularPrice: 1800,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 19,
          name: "Highland Cows",
          slug: "highland-cows"
        }
      ],
      images: [
        "/family-assets/ghjk.jpg",
        "/family-assets/dfghjk.jpg",
        "/family-assets/fghj.jpg",
        "/family-assets/ghjk.jpg",
        "/family-assets/hjk.jpg"
      ]
    },
    {
      id: 16819,
      slug: "luna",
      name: "Luna",
      description: "Meet Luna \u2013 Adorable 3-Month-Old Female Mini Highland Cow\n\n\nMeet Luna, a beautiful 3-month-old female Mini Highland Cow with an adorable fluffy coat, sweet expression, and the distinctive Highland look that makes these cattle so special.\n\n\nLuna is a charming young heifer with plenty of personality. At just three months old, she has the irresistible appearance of a classic Highland calf and is sure to become a wonderful addition to the right farm, homestead, hobby farm, or small cattle operation.\n\n\n\u{1F42E} Luna at a Glance\n\n\n\nName: Luna\n\n\nAge: 3 months old\n\n\nGender: Female\n\n\nBreed: Mini Highland Cow\n\n\nType: Mini Highland heifer / female Highland calf\n\n\nAppearance: Fluffy coat and distinctive Highland features\n\n\nIdeal for: Hobby farms, small farms, homesteads, and Highland cattle enthusiasts\n\n\n\nLuna\u2019s sweet face, fluffy appearance, and charming personality make her a delightful young Mini Highland calf. She is a wonderful option for anyone looking to add a special young heifer to their farm or begin growing a collection of miniature Highland cattle.\n\n\nIf you\u2019ve been searching for a Mini Highland Cow for sale, female Mini Highland calf, 3-month-old Highland calf, Mini Highland heifer, miniature Highland cattle, or fluffy Highland cow, Luna is a lovely young heifer to consider.\n\n\nContact us today to learn more about Luna and her availability.\n\n\nMini Highland Cow for sale, female Mini Highland Cow, Luna Mini Highland Cow, 3-month-old Highland calf, female Highland calf, Mini Highland heifer, miniature Highland cattle, Mini Highland calf, fluffy Highland calf, Highland heifer for sale, female Mini Highland calf, Mini Highland cattle for sale, Highland cattle for sale.",
      shortDescription: "",
      price: 950,
      regularPrice: 2e3,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 19,
          name: "Highland Cows",
          slug: "highland-cows"
        }
      ],
      images: [
        "/family-assets/fghfghjfghj.jpg",
        "/family-assets/erfty.jpg",
        "/family-assets/fghfghjfghj.jpg",
        "/family-assets/fghjfghj.jpg",
        "/family-assets/fghtyutyuyu.jpg"
      ]
    },
    {
      id: 16806,
      slug: "shelly",
      name: "shelly",
      description: "Say hello to Shelly, a beautiful 2-month-old female mini donkey with a gentle nature and adorable personality! With her soft coat, petite size, and sweet expression, Shelly is sure to capture hearts wherever she goes.\n\n\nAt just 2 months old, Shelly is already well-socialized and comfortable around people. She is calm, curious, and enjoys attention, making her easy to handle and a wonderful choice for families, hobby farms, or anyone looking for a friendly companion animal.\n\n\nMini donkeys are known for their affectionate temperament, intelligence, and strong bonding ability. Shelly will thrive in a loving environment where she can receive care, companionship, and plenty of interaction.\n\n\nKey Features:\n\n\n\nName: Shelly\n\n\nBreed: Female mini donkey\n\n\nAge: 2 months old\n\n\nFriendly, gentle, and playful\n\n\nEasy to manage and well-socialized\n\n\nPerfect for small farms, families, or companionship\n\n\n\nDon\u2019t miss the chance to bring Shelly home\u2014she\u2019s a sweet little donkey ready to become a cherished part of your family!\n\n\n\nmini donkeys for sale\n\n\nminiature donkeys\n\n\nmini donkey for sale near me\n\n\nbaby mini donkey\n\n\nminiature donkey breeders\n\n\nmini donkeys price\n\n\nmini donkeys farm\n\n\ncute mini donkeys\n\n\nfriendly miniature donkeys\n\n\nmini donkeys as pets\n\n\nadorable baby donkeys\n\n\nsmall farm animals for sale\n\n\nbackyard farm animals\n\n\neasy to care farm animals\n\n\nbuy mini donkey online\n\n\nmini donkey breeders near me\n\n\nminiature donkeys for homestead\n\n\nmini donkeys for families\n\n\nmini donkeys for petting zoo\n\n\naffordable mini donkeys for sale\n\n\nminiature donkey for small farm\n\n\nmini donkeys for companionship\n\n\nbest farm animals for beginners\n\n\nmini donkeys care and temperament\n\n\nminiature donkeys for sustainable living",
      shortDescription: "",
      price: 900,
      regularPrice: 1500,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 258,
          name: "Mini donkeys",
          slug: "mini-donkeys"
        }
      ],
      images: [
        "/family-assets/579870195_807087658907877_2704398102658121233_n.jpg",
        "/family-assets/578643545_807086965574613_6770341389417073647_n.jpg",
        "/family-assets/579599445_807086912241285_2692654856188494955_n.jpg",
        "/family-assets/579870195_807087658907877_2704398102658121233_n.jpg",
        "/family-assets/634153222_122212610420535733_8642924956860734108_n.jpg"
      ]
    },
    {
      id: 16774,
      slug: "debi",
      name: "Debi",
      description: "Introducing Debi, an adorable 2-month-old female mini donkey with a sweet personality and lots of charm! With her soft coat, tiny frame, and gentle eyes, Debi is a perfect little companion ready to bring joy to her new home.\n\n\nAt just 2 months old, Debi is already showing a calm and friendly temperament. She is well-socialized, enjoys human interaction, and is easy to handle\u2014making her a great choice for families, hobby farms, or first-time livestock owners.\n\n\nMini donkeys are known for their affectionate nature, intelligence, and strong bonding ability. Debi will thrive in a caring environment where she can receive attention and companionship, whether alongside other animals or as a beloved pet.\n\n\n\n\nName: Debi\n\n\nBreed: Female mini donkey\n\n\nAge: 2 months old\n\n\nGentle, friendly, and playful\n\n\nWell-socialized and easy to manage\n\n\nIdeal for small farms, families, or companionship\n\n\n\nDon\u2019t miss the opportunity to welcome Debi into your life\u2014she\u2019s a lovable little donkey ready for her forever home!\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n3 messages remaining.\xA0Start a free Plus trial to keep the",
      shortDescription: "",
      price: 900,
      regularPrice: 1500,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 258,
          name: "Mini donkeys",
          slug: "mini-donkeys"
        }
      ],
      images: [
        "/family-assets/574855707_801336029483040_5510728955125832240_n.jpg",
        "/family-assets/574476456_801336012816375_5772268381072065464_n.jpg",
        "/family-assets/574855707_801336029483040_5510728955125832240_n.jpg",
        "/family-assets/576542548_801336042816372_6856122734301120057_n.jpg"
      ]
    },
    {
      id: 16766,
      slug: "nataly-3",
      name: "Nataly",
      description: "Say hello to Nataly, an adorable 4-month-old mini donkey with a sweet personality and irresistible charm! With her soft coat, bright eyes, and playful nature, Nataly is the perfect addition to any loving farm or homestead.\n\n\nAt just 4 months old, Nataly is already well-socialized and comfortable around people. She is gentle, curious, and enjoys attention, making her easy to handle and a wonderful companion for both adults and children.\n\n\nMini donkeys are known for their friendly temperament, intelligence, and strong bonding ability. They do well as companion animals and thrive in environments where they receive regular care and interaction.\n\n\n\nName: Nataly\n\n\nBreed: Mini donkey\n\n\nAge: 4 months old\n\n\nFriendly, gentle, and playful\n\n\nWell-socialized and easy to manage\n\n\nIdeal for farms, families, or companionship\n\n\n\nDon\u2019t miss the chance to bring home Nataly\u2014she\u2019s a lovable little donkey ready to become part of your family!\n\n\n\nMini donkey for sale\n\n\nBuy mini donkey\n\n\nMiniature donkey for sale\n\n\nBaby mini donkey\n\n\nMini donkey breeder\n\nMini horse for sale\n\n\nMiniature horse\n\n\nMini Highland cow\n\n\nPet goat for sale\n\n\nPygmy goat for sale\n\n\nSmall farm animals for sale\n\n\n\n\n\n\n\n\n\nMini donkey for sale near me\n\n\nMini donkey breeders near me\n\n\nAffordable mini donkey in [your location]\n\n\nFarm animals near me\n\nCheap mini donkey for sale\n\n\nAffordable miniature donkey\n\n\nFriendly mini donkey for pets\n\n\nMini donkey companion animal\n\n\n\n\n\n\n\n\n\nMini donkey for small farms\n\n\nBackyard farm animals\n\n\nFamily-friendly farm animals\n\n\nEasy to raise livestock\n\n\nCompanion farm animal",
      shortDescription: "",
      price: 850,
      regularPrice: 1600,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 258,
          name: "Mini donkeys",
          slug: "mini-donkeys"
        }
      ],
      images: [
        "/family-assets/674129225_10243183904032497_2485046362132397814_n.jpg",
        "/family-assets/673711178_10243183903472483_5032849582797128002_n.jpg",
        "/family-assets/674129225_10243183904032497_2485046362132397814_n.jpg",
        "/family-assets/675972501_10243183903352480_3851875536755242350_n.jpg",
        "/family-assets/677132664_10243183904352505_1344594930581880048_n.jpg"
      ]
    },
    {
      id: 16752,
      slug: "marcus",
      name: "marcus",
      description: "Introducing Marcus, a handsome male Mini Highland cow with a truly striking appearance and a calm, gentle nature. With his long, shaggy coat and classic Highland features, Marcus is a perfect example of this beloved breed in a smaller, more manageable size.\n\n\nMarcus is well-socialized and comfortable around people, making him easy to handle and a great addition to any farm, homestead, or hobby ranch. His friendly temperament and relaxed personality make him suitable for both experienced owners and beginners alike.\n\n\nMini Highland cows are known for their hardiness, low-maintenance care, and ability to adapt to various climates. Marcus not only brings beauty and charm but also offers great potential as a companion animal or future breeding prospect.\n\n\nKey Features:\n\n\n\nName: Marcus\n\n\nBreed: Male Mini Highland cow\n\n\nFriendly and docile temperament\n\n\nThick, shaggy coat with classic Highland look\n\n\nEasy to manage and care for\n\n\nIdeal for small farms, homesteads, or companionship\n\n\n\nDon\u2019t miss the opportunity to welcome Marcus to your farm\u2014he\u2019s a standout addition that will surely turn heads and win hearts!",
      shortDescription: "",
      price: 1e3,
      regularPrice: 1500,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 19,
          name: "Highland Cows",
          slug: "highland-cows"
        }
      ],
      images: [
        "/family-assets/670417151_122099831438776072_3055500058065498438_n.jpg",
        "/family-assets/669504309_122099831948776072_7708921292557207376_n.jpg",
        "/family-assets/670269170_122099831570776072_1228684319812344005_n.jpg",
        "/family-assets/670417151_122099831438776072_3055500058065498438_n.jpg",
        "/family-assets/672319931_122099831402776072_286195643816963232_n.jpg"
      ]
    },
    {
      id: 16742,
      slug: "jassa-and-ngo",
      name: "jassa and ngo",
      description: "Pair of Mini Highland Cows for Sale \u2013 Meet Jassa & Ngo \u{1F42E}\u{1F42E}\n\n\nIntroducing Jassa and Ngo, a beautiful pair of Mini Highland cows ready for their new home! These charming cattle are known for their signature long, shaggy coats, gentle personalities, and smaller, easy-to-manage size\u2014making them perfect for hobby farms and homesteads.\n\n\nJassa and Ngo are well-socialized, calm, and accustomed to human interaction, making them easy to handle and a joy to have around. Their thick, fluffy coats and classic Highland features make them truly eye-catching additions to any property.\n\n\nMini Highland cows are hardy animals that adapt well to different climates and require less space than standard cattle. As a pair, Jassa and Ngo are already bonded, making the transition to their new home smoother and more comfortable for both animals.[\n\n\n\nNames: Jassa & Ngo\n\n\nBreed: Mini Highland cows (pair)\n\n\nFriendly, calm, and easy to manage\n\n\nThick, shaggy coats with classic Highland look\n\n\nIdeal for small farms, homesteads, or companionship\n\n\nBonded pair \u2013 great for stress-free integration\n\n\n\nDon\u2019t miss this opportunity to own a stunning and lovable pair\u2014Jassa and Ngo are sure to bring beauty and charm to any farm!Cows for sale\n\n\n\nBuy cows online\n\n\nCattle for sale\n\n\nLivestock for sale\n\n\nFarm animals for sale\n\n\nHealthy cows for sale\n\n\nMini Highland cows for sale\n\n\nHighland cattle for sale\n\n\nDairy cows for sale\n\n\nBeef cattle for sale\n\n\nMini cows for sale\n\n\nExotic cattle breeds\n\n\nCows for sale near me\n\n\nCattle for sale in [your city/country]\n\n\nLocal livestock farmers\n\n\nFarm animals near me\n\n\nAffordable cows for sale\n\n\nCheap cattle for sale\n\n\nQuality livestock breeders\n\n\nTrusted cattle sellers\n\n\nBuy farm animals online\n\n\nCows for small farms\n\n\nHomestead animals\n\n\nEasy to raise cattle\n\n\nGrass-fed cattle\n\n\nFamily farm animals\n\n\nMini Highland cows for sale near me\n\n\nFriendly cows for small farms\n\n\nWhere to buy cows online\n\n\nBest cattle breeds for beginners\n\n\nHealthy farm cows for sale\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n1 message remaining.\xA0Start a free Plus trial to keep the conve",
      shortDescription: "",
      price: 1800,
      regularPrice: 3e3,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 19,
          name: "Highland Cows",
          slug: "highland-cows"
        }
      ],
      images: [
        "/family-assets/669787287_122099842106776072_9073328982105026779_n.jpg",
        "/family-assets/668715887_122099842424776072_4707672176656508604_n.jpg",
        "/family-assets/668993030_122099842208776072_610465879921373323_n.jpg",
        "/family-assets/669787287_122099842106776072_9073328982105026779_n.jpg",
        "/family-assets/671108894_122099842388776072_3987521102161993758_n.jpg",
        "/family-assets/671941310_122099842082776072_4983937746801357470_n.jpg"
      ]
    },
    {
      id: 16735,
      slug: "paola",
      name: "paola",
      description: "This adorable 8-week-old Juliana piglet is ready to find a loving new home! Known for their small size, intelligence, and sweet personalities, Juliana pigs make excellent pets and companions for families, homesteads, or small farms.\n\n\nThis piglet is healthy, active, and well-socialized, making it easy to handle and a joy to raise. With its unique markings and charming personality, it\u2019s sure to quickly become a favorite wherever it goes.\n\n\nJuliana piglets are highly trainable, clean, and adaptable to both indoor and outdoor environments when properly cared for. Their manageable size and friendly nature make them a great choice for both first-time and experienced owners.\n\n\n\nBreed: Juliana piglet\n\n\nAge: 8 weeks old\n\n\nFriendly, playful, and intelligent\n\n\nEasy to train and manage\n\n\nIdeal as a pet or companion animal\n\n\n\nDon\u2019t miss the opportunity to bring home this lovable piglet\u2014it\u2019s ready to become part of your family!\n\n\n\n\nMini Juliana pig for sale\n\n\nJuliana piglet\n\n\nMini pig for sale\n\n\nPet piglet\n\n\nFemale mini pig\n\n\nMispa mini pig\n\n\n8 week old piglet\n\n\nSpotted mini pig\n\n\nFriendly piglet for sale\n\n\nBaby Juliana pig\n\n\nEasy to train pig\n\n\nIndoor pet pig\n\n\nOutdoor farm pig\n\n\nSmall farm animals\n\n\nCompanion livestock",
      shortDescription: "",
      price: 150,
      regularPrice: 300,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 256,
          name: "Mini pig",
          slug: "mini-pig"
        }
      ],
      images: [
        "/family-assets/651187984_122118256413167581_3595371013408022783_n.jpg",
        "/family-assets/650718924_122118256401167581_6642967147220324486_n.jpg",
        "/family-assets/651187984_122118256413167581_3595371013408022783_n.jpg",
        "/family-assets/651226019_122118256383167581_8657532457430067977_n.jpg"
      ]
    },
    {
      id: 16727,
      slug: "mispa",
      name: "mispa",
      description: "Say hello to Mispa, an adorable 8-week-old Mini Juliana piglet full of personality and charm! Known for their intelligence, gentle nature, and unique spotted patterns, Mini Juliana pigs make wonderful pets and companions\u2014and Mispa is no exception.\n\n\nAt just 8 weeks old, Mispa is already showing a friendly, curious temperament and loves human interaction. She is well-socialized, active, and growing beautifully, making her a perfect addition to a loving home, small farm, or homestead.\n\n\nMini Juliana pigs are highly trainable, clean animals that can adapt well to both indoor and outdoor environments when properly cared for. Mispa\u2019s petite size and sweet nature make her especially appealing for families or first-time pig owners.\n\n\nKey Features:\n\n\n\nName: Mispa\n\n\nBreed: Mini Juliana pig\n\n\nAge: 8 weeks old\n\n\nFriendly, playful, and intelligent\n\n\nUnique spotted coat pattern\n\n\nIdeal as a pet or companion animal\n\n\n\nDon\u2019t miss the chance to welcome Mispa into your life\u2014she\u2019s a tiny bundle of joy ready for her forever home!\n\n\n\nMini Juliana pig for sale\n\n\nJuliana piglet\n\n\nMini pig for sale\n\n\nPet piglet\n\n\nFemale mini pig\n\n\nMispa mini pig\n\n\n8 week old piglet\n\n\nSpotted mini pig\n\n\nFriendly piglet for sale\n\n\nBaby Juliana pig\n\nEasy to train pig\n\n\nIndoor pet pig\n\n\nOutdoor farm pig\n\n\nSmall farm animals\n\n\nCompanion livestock\n\nBuy mini pig near me\n\n\nAffordable mini pig\n\n\nCute piglet for sale\n\n\nFamily pet pig\n\n\nMini pig breede",
      shortDescription: "",
      price: 150,
      regularPrice: 300,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 256,
          name: "Mini pig",
          slug: "mini-pig"
        }
      ],
      images: [
        "/family-assets/670834053_122094637790691992_5236838554481540251_n.jpg",
        "/family-assets/668823042_122094637868691992_5553827082421170963_n.jpg",
        "/family-assets/669848060_122094637910691992_607443233661847850_n.jpg",
        "/family-assets/669864517_122094637832691992_5414667373978124742_n.jpg",
        "/family-assets/670834053_122094637790691992_5236838554481540251_n.jpg"
      ]
    },
    {
      id: 16714,
      slug: "natalia",
      name: "Natalia",
      description: "\u{1F410} Female Nigerian Dwarf Goat for Sale \u2013 Meet NATALIA (13 Weeks Old)\n\n\nSearching for a Nigerian Dwarf goat for sale? Meet NATALIA, a beautiful 13-week-old female goat ready for her forever home! She is healthy, active, and raised with excellent care, making her a perfect choice for farmers and homesteaders.\n\n\n\u2728 Why choose NATALIA?\n\n\n\n\u2705 13 weeks old \u2013 young, strong, and easy to raise\n\n\n\u2705 Friendly, gentle temperament \u2013 great for beginners\n\n\n\u2705 Ideal for breeding, dairy production, or as a pet\n\n\n\u2705 Perfect for backyard farming, small farms, and homesteading\n\n\n\u2705 Well-socialized and accustomed to human interaction\n\n\n\nNigerian Dwarf goats are highly popular for their compact size, high butterfat milk, and low maintenance, making them one of the best options for anyone searching for mini goats for sale or quality breeding goats.\n\n\nNATALIA is alert, playful, and adapts quickly to new environments. Don\u2019t miss this chance to own a premium Nigerian Dwarf goat that will be a valuable addition to your herd.\n\n\n\u{1F4E9} Contact now for more details \u2013 serious buyers only!\n\n\nNigerian Dwarf goat for sale, female dwarf goat, mini goat for sale, baby goat 13 weeks, goats for sale near me, healthy goats, breeding goats, backyard farm animals, small farm livestock",
      shortDescription: "",
      price: 200,
      regularPrice: 300,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 185,
          name: "Nigeria Dwarf Goat",
          slug: "nigeria-dwarf-goat"
        }
      ],
      images: [
        "/family-assets/rgr.jpg",
        "/family-assets/gb.jpg",
        "/family-assets/gbt.jpg",
        "/family-assets/grg.jpg",
        "/family-assets/rgr.jpg",
        "/family-assets/rgrg.jpg",
        "/family-assets/rrb.jpg"
      ]
    },
    {
      id: 16704,
      slug: "jenny-2",
      name: "Jenny",
      description: "\u{1F410} Nigerian Dwarf Goat for Sale \u2013 Meet JENNY (12 Weeks Old)\n\n\nLooking for the perfect Nigerian Dwarf goat for sale? Meet JENNY, an adorable 12-week-old female goat ready to join her new home! She is healthy, playful, and raised with proper care, making her an excellent choice for any farm or homestead.\n\n\n\u2728 Why JENNY stands out:\n\n\n\n\u2705 12 weeks old \u2013 young, strong, and easy to raise\n\n\n\u2705 Friendly, gentle, and easy to handle\n\n\n\u2705 Perfect for breeding, dairy production, or as a pet\n\n\n\u2705 Ideal for small farms, backyard farming, and homesteading\n\n\n\u2705 Well-socialized and used to human interaction\n\n\n\nJENNY is active, alert, and adapts quickly to new environments. Nigerian Dwarf goats are highly sought after for their mini size, high-quality milk, and low maintenance, making them perfect for beginners and experienced farmers alike.\n\n\n\u{1F525} Don\u2019t miss out on this healthy Nigerian Dwarf goat for sale \u2013 she\u2019s a great addition to any herd!\n\n\nNigerian Dwarf goat for sale, baby goat for sale, dwarf goats near me, mini dairy goat, female goat for sale, backyard farm animals, small farm livestock, healthy goats, breeding goats",
      shortDescription: "",
      price: 180,
      regularPrice: 300,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 185,
          name: "Nigeria Dwarf Goat",
          slug: "nigeria-dwarf-goat"
        }
      ],
      images: [
        "/family-assets/656816928_870552979363166_3508522062896992788_n.jpg",
        "/family-assets/656357969_870553042696493_3686676074501547556_n.jpg",
        "/family-assets/656680259_870553062696491_5513999184638786095_n.jpg",
        "/family-assets/656816928_870552979363166_3508522062896992788_n.jpg",
        "/family-assets/658186000_870553102696487_5105381529072094430_n.jpg",
        "/family-assets/d.jpg",
        "/family-assets/fd.jpg"
      ]
    },
    {
      id: 16695,
      slug: "princes",
      name: "princes",
      description: "\u{1F410} Nigerian Dwarf Goat for Sale \u2013 Meet PRINCES (14 Weeks Old)\n\n\nIntroducing PRINCES, a beautiful 14-week-old Nigerian Dwarf goat ready for a new home! PRINCES is healthy, active, and well-raised, making her a perfect addition to any farm or homestead.\n\n\nShe has a friendly and gentle temperament, is easy to handle, and is already accustomed to human interaction. Nigerian Dwarf goats are known for their small size, great adaptability, and potential for milk production, making them ideal for both beginners and experienced farmers.\n\n\n\u{1F33F} Why choose PRINCES?\n\n\n\n\u2705 14 weeks old \u2013 young and easy to raise\n\n\n\u2705 Healthy, strong, and well cared for\n\n\n\u2705 Friendly and social personality\n\n\n\u2705 Perfect for breeding, dairy, or as a pet\n\n\n\u2705 Great for small farms and backyard setups\n\n\n\nPRINCES is alert, playful, and ready to thrive in her new environment. Don\u2019t miss the chance to add this lovely goat to your herd!\n\n\n\u{1F4E9} Contact now for more details \u2013 serious inquiries only.",
      shortDescription: "",
      price: 200,
      regularPrice: 300,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [],
      images: [
        "/family-assets/662270944_122105042294917375_2633134540141220336_n.jpg",
        "/family-assets/1.jpg",
        "/family-assets/659749554_122105042258917375_6580172082056149129_n.jpg",
        "/family-assets/660094761_122105042204917375_665220379433087619_n.jpg",
        "/family-assets/662270944_122105042294917375_2633134540141220336_n.jpg",
        "/family-assets/662529398_122105042246917375_7601664858520016874_n.jpg"
      ]
    },
    {
      id: 16686,
      slug: "sonia",
      name: "sonia",
      description: "Looking for a Nigerian Dwarf goat for sale? This beautiful female Nigerian Dwarf goat is the perfect addition to your farm or homestead. Known for their compact size, excellent milk production, and gentle temperament, Nigerian Dwarf goats are one of the most popular choices for both beginners and experienced farmers.\n\n\n\u{1F33F} Key Features:\n\n\n\n\u2705 Healthy, strong, and well-cared-for\n\n\n\u2705 Friendly and easy to handle\n\n\n\u2705 Ideal for breeding, dairy production, or petting farms\n\n\n\u2705 Adaptable to different environments\n\n\n\u2705 Raised with proper nutrition and care\n\n\n\nThis mini dairy goat is active, alert, and used to human interaction, making her easy to manage and integrate into your herd. Whether you\u2019re searching for goats for sale near me, dwarf goats for small farms, or quality breeding goats, this female is a fantastic choice.\n\n\n\u{1F4CD} Perfect for homesteading, backyard farming, and sustainable living.\n\n\nDon\u2019t miss out on this opportunity to own a premium Nigerian Dwarf goat. Contact now for more details\u2014serious buyers only!\n\n\nNigerian Dwarf goat for sale, female dwarf goat, mini dairy goat, goats for sale near me, healthy goats, breeding goats, backyard farm animals, small farm livestock",
      shortDescription: "",
      price: 150,
      regularPrice: 300,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 185,
          name: "Nigeria Dwarf Goat",
          slug: "nigeria-dwarf-goat"
        }
      ],
      images: [
        "/family-assets/668090492_122105874860917375_5182845996332088548_n.jpg",
        "/family-assets/663174503_122105874872917375_913670804390438363_n.jpg",
        "/family-assets/667645071_122105874938917375_359617218229641808_n.jpg",
        "/family-assets/667850820_122105874926917375_4900769814788881397_n.jpg",
        "/family-assets/668090492_122105874860917375_5182845996332088548_n.jpg",
        "/family-assets/668914927_122105874950917375_881697713562038416_n.jpg"
      ]
    },
    {
      id: 16677,
      slug: "media",
      name: "media",
      description: "Meet MEDIA, a beautiful Nigerian Dwarf goat now available for sale. MEDIA is a healthy, well-raised adult goat with a friendly temperament and excellent adaptability, making her a perfect addition to any farm or homestead.\n\n\nShe is known for her compact size, high-quality genetics, and good overall condition. Nigerian Dwarf goats are popular for their easy management and potential for milk production, and MEDIA is no exception\u2014she has been properly cared for and is in great shape.\n\n\nMEDIA is active, alert, and accustomed to human interaction, which makes handling easy even for beginners. Whether you\u2019re looking to expand your herd, start a small-scale farming project, or simply add a charming and productive animal to your property, MEDIA is a great choice.\n\n\nSerious inquiries only\u2014don\u2019t miss the opportunity to own this wonderful goat!",
      shortDescription: "",
      price: 150,
      regularPrice: 300,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 262,
          name: "nigerian dwarf goat",
          slug: "nigerian-dwarf-goat"
        }
      ],
      images: [
        "/family-assets/619900157_122112443811183461_7891595996027545694_n.jpg",
        "/family-assets/622790613_122112443835183461_1496171705950677683_n.jpg",
        "/family-assets/620034900_122112443823183461_3457691827510141839_n.jpg",
        "/family-assets/619900157_122112443811183461_7891595996027545694_n.jpg",
        "/family-assets/618667622_122112443853183461_7145342478135436769_n.jpg"
      ]
    },
    {
      id: 16664,
      slug: "acness",
      name: "Acness",
      description: "Introducing Acness, a beautiful female Valais Blacknose sheep with exceptional charm and elegance. Known for their signature black face, ears, and knees paired with a thick, fluffy white fleece, Valais Blacknose sheep are often called the \u201Ccutest sheep in the world\u201D\u2014and Acness truly lives up to that reputation.\n\n\nAcness has a gentle, friendly temperament and is well-socialized, making her easy to handle and a wonderful addition to any farm or homestead. She is healthy, well cared for, and shows excellent breed characteristics, making her a great option for breeding or as a delightful companion animal.\n\n\nWith her calm nature and striking appearance, Acness is perfect for hobby farmers, families, or anyone looking to add a unique and lovable sheep to their flock.\n\n\nKey Features:\n\n\n\nName: Acness\n\n\n9weeks old\n\n\nBreed: Female Valais Blacknose sheep\n\n\nCalm, friendly, and easy to manage\n\n\nThick, high-quality wool\n\n\nIdeal for breeding, small farms, or companionship\n\n\n\nDon\u2019t miss the opportunity to welcome Acness to your farm\u2014she\u2019s sure to capture hearts and stand out wherever she goes!",
      shortDescription: "",
      price: 500,
      regularPrice: 1e3,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 255,
          name: "valais sheep",
          slug: "valais-sheep"
        }
      ],
      images: [
        "/family-assets/649681282_1375249154405047_7588742164344999444_n-Copy-Copy.jpg",
        "/family-assets/649038869_1375248804405082_8651508157952914465_n.jpg",
        "/family-assets/649046414_1375248771071752_1935383413049800219_n-Copy-Copy.jpg",
        "/family-assets/649681282_1375249154405047_7588742164344999444_n-Copy-Copy.jpg",
        "/family-assets/648976131_1375248284405134_512749158030970150_n.jpg"
      ]
    },
    {
      id: 16648,
      slug: "billy",
      name: "Billy",
      description: "Introducing Billy, a stunning Valais Blacknose sheep with irresistible charm and standout looks! Known as the \u201Cworld\u2019s cutest sheep,\u201D the Valais Blacknose breed is famous for its distinctive black face, fluffy white fleece, and incredibly friendly nature\u2014and Billy is no exception.\n\n\nBilly has a calm, gentle temperament and is well-socialized, making him perfect for families, hobby farms, or anyone looking to add a unique and lovable animal to their flock. His thick, high-quality wool and strong build also make him a great potential breeding prospect.\n\n\nThis handsome ram is healthy, well-cared-for, and thrives in a variety of environments. Whether you\u2019re looking for a companion animal, a show-quality sheep, or a standout addition to your farm, Billy is sure to impress.\n\n\nKey Features:\n\n\n\nName: Billy\n\n\nBreed: Valais Blacknose sheep\n\n\nFriendly and easy to handle\n\n\nDistinctive black face and fluffy coat\n\n\nIdeal for small farms, breeding, or companionship\n\n\n\nDon\u2019t miss out on Billy\u2014he\u2019s as charming as he is unique and ready for his new home!",
      shortDescription: "",
      price: 750,
      regularPrice: 1500,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 255,
          name: "valais sheep",
          slug: "valais-sheep"
        }
      ],
      images: [
        "/family-assets/648795920_927030823410880_2801324576389964747_n-1.jpg",
        "/family-assets/650293785_929446703169292_3680722230648422764_n-Copy.jpg",
        "/family-assets/648795920_927030823410880_2801324576389964747_n.jpg",
        "/family-assets/648732732_927030713410891_8155590069870683117_n.jpg",
        "/family-assets/650162164_929446673169295_7501959102495902034_n-Copy.jpg"
      ]
    },
    {
      id: 16641,
      slug: "demon",
      name: "demon",
      description: "Meet this charming male Mini Highland cow DEMON \u2014 the perfect addition to your farm, homestead, or hobby ranch! Known for their iconic long shaggy coats and gentle personalities, Mini Highlands are a favorite for both beginners and experienced livestock owners.\n\n\nThis handsome little bull features a thick, fluffy coat, expressive eyes, and the classic Highland look in a smaller, more manageable size. He is well-socialized, calm, and accustomed to human interaction, making him easy to handle and a joy to be around.\n\n\nMini Highland cattle are not only beautiful but also hardy and low-maintenance. They adapt well to various climates, require less space than standard cattle, and are excellent grazers. Whether you\u2019re looking for a companion animal, a breeding prospect, or simply a unique addition to your property, this little guy fits the bill perfectly.\n\n\nKey Features:\n\n\n\nMale Mini Highland cow\n\n\nFriendly and docile temperament\n\n\nThick, fluffy coat\n\n\nEasy to manage and care for\n\n\nIdeal for small farms or hobby homesteads\n\n\n\nDon\u2019t miss the chance to own this lovable and eye-catching animal \u2014 he\u2019s sure to steal hearts wherever he goes!",
      shortDescription: "",
      price: 1100,
      regularPrice: 1700,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 19,
          name: "Highland Cows",
          slug: "highland-cows"
        },
        {
          id: 255,
          name: "valais sheep",
          slug: "valais-sheep"
        }
      ],
      images: [
        "/family-assets/468409152_122099985968643490_5679226873049348080_n.jpg",
        "/family-assets/468409152_122099985968643490_5679226873049348080_n.jpg",
        "/family-assets/468409840_122099985842643490_1447185732059004383_n.jpg",
        "/family-assets/468423241_122099985812643490_8935919857654090174_n.jpg"
      ]
    },
    {
      id: 16628,
      slug: "carlos",
      name: "Carlos",
      description: "Meet this charming male Mini Highland cow \u2014 the perfect addition to your farm, homestead, or hobby ranch! Known for their iconic long shaggy coats and gentle personalities, Mini Highlands are a favorite for both beginners and experienced livestock owners.\n\n\nThis handsome little bull features a thick, fluffy coat, expressive eyes, and the classic Highland look in a smaller, more manageable size. He is well-socialized, calm, and accustomed to human interaction, making him easy to handle and a joy to be around.\n\n\nMini Highland cattle are not only beautiful but also hardy and low-maintenance. They adapt well to various climates, require less space than standard cattle, and are excellent grazers. Whether you\u2019re looking for a companion animal, a breeding prospect, or simply a unique addition to your property, this little guy fits the bill perfectly.\n\n\nKey Features:\n\n\n\n\nMale Mini Highland cow\n\n\n\n\n\n4months old\n\n\n\nFriendly and docile temperament\n\n\n\n\n\n\nThick, fluffy coat\n\n\n\n\n\n\nEasy to manage and care for\n\n\n\n\n\n\nIdeal for small farms or hobby homesteads\n\n\n\n\n\n\nDon\u2019t miss the chance to own this lovable and eye-catching animal \u2014 he\u2019s sure to steal hearts wherever he goes!",
      shortDescription: "",
      price: 1300,
      regularPrice: 2500,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 19,
          name: "Highland Cows",
          slug: "highland-cows"
        }
      ],
      images: [
        "/family-assets/609129689_810355982008880_1075218845921678906_n.jpg",
        "/family-assets/611131733_810356232008855_2581238104437751763_n.jpg",
        "/family-assets/610668974_810355848675560_87841532930090124_n.jpg",
        "/family-assets/609164506_810356138675531_2678817932439350352_n.jpg",
        "/family-assets/609129689_810355982008880_1075218845921678906_n.jpg"
      ]
    },
    {
      id: 16604,
      slug: "leonard-and-zina",
      name: "leonard and zina",
      description: "Meet Leonard and Zina, a healthy and well-raised pair of Nigerian Dwarf goats ready for their new home. These goats have been raised together in a clean, caring environment with proper nutrition and regular handling, making them friendly, social, and easy to manage.\n\n\nNigerian Dwarf goats are known for their small size, gentle temperament, and excellent adaptability, making them perfect for backyard farms, homesteads, and small breeding programs. Leonard and Zina are active, well-socialized, and comfortable around people. Keeping them as a pair helps reduce stress and makes their transition to a new home easier.\n\n\nThis pair is ideal for anyone looking to start or expand a small herd, begin a breeding program, or add friendly, low-maintenance animals to their farm. Nigerian Dwarfs are hardy, efficient, and well-suited for both beginners and experienced goat owners.\n\n\n\u{1F410} Names: Leonard (male) & Zina (female)\u{1F3E1} Ideal for: Breeding, pets, homesteads, and small farms\u2714 Healthy, bonded pair and well-socialized\n\n\nLeonard and Zina are ready for a caring new owner. Serious inquiries only.",
      shortDescription: "",
      price: 350,
      regularPrice: 600,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 259,
          name: "boer goats",
          slug: "boer-goats"
        },
        {
          id: 185,
          name: "Nigeria Dwarf Goat",
          slug: "nigeria-dwarf-goat"
        }
      ],
      images: [
        "/family-assets/492420477_1248776830582254_7069813314875439214_n.jpg",
        "/family-assets/492431635_1248776947248909_3363274733928445213_n.jpg",
        "/family-assets/492420477_1248776830582254_7069813314875439214_n.jpg",
        "/family-assets/492100732_1248776943915576_5698728600062068650_n.jpg",
        "/family-assets/492118231_1248776907248913_6869029491906476638_n.jpg"
      ]
    },
    {
      id: 16595,
      slug: "lesline",
      name: "lesline",
      description: "Meet Lesline, a beautiful and healthy female Mini Highland cow ready for her new home. She has been raised with great care in a clean, well-managed environment and is provided with quality nutrition and regular handling to ensure excellent health and a gentle temperament.\n\n\nMini Highland cattle are known for their calm nature, hardy build, and manageable size, making them perfect for small farms, homesteads, and hobby farmers. Lesline is friendly, well-socialized, and adapts easily to new surroundings. Her thick, fluffy coat and classic Highland look make her a charming and valuable addition to any herd.\n\n\nLesline is an excellent choice for breeding, pasture grazing, or as a standout addition to your farm. Mini Highlands are low-maintenance, efficient grazers, and thrive in a variety of climates, making them ideal for sustainable and small-scale farming.\n\n\n\u{1F404} Name: Lesline\n\n\nn: [Your Location]\u{1F33E} Ideal for: Breeding, homesteads, small farms, and hobby farming\u2714 Healthy, well-raised, and easy to handle\n\n\nLesline is ready for a caring new owner. Serious inquiries only.",
      shortDescription: "",
      price: 1100,
      regularPrice: 1700,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 19,
          name: "Highland Cows",
          slug: "highland-cows"
        }
      ],
      images: [
        "/family-assets/477009899_606983732083532_6371849686808077758_n.jpg",
        "/family-assets/477009899_606983732083532_6371849686808077758_n.jpg",
        "/family-assets/477851791_606983572083548_3634194630972824655_n.jpg",
        "/family-assets/478502065_606983502083555_659901552283294982_n.jpg"
      ]
    },
    {
      id: 16587,
      slug: "rony",
      name: "Rony",
      description: "Meet Rony, a handsome and well-raised male Mini Highland cow ready for his new home. Rony has been raised with excellent care in a clean and healthy environment, receiving proper nutrition and regular attention to ensure strong growth and a calm temperament.\n\n\nMini Highland cattle are known for their gentle nature, hardiness, and manageable size, making them a great choice for small farms, homesteads, hobby farmers, or breeding programs. Rony is healthy, active, and well-socialized, making him easy to handle and adaptable to new surroundings. His thick, fluffy coat and classic Highland appearance make him not only a practical addition to your farm but also a beautiful one.\n\n\nRony is growing well and shows great potential for breeding or as a quality addition to a small cattle herd. Mini Highlands are low-maintenance, hardy in various climates, and efficient grazers, making them ideal for sustainable and small-scale farming.\n\n\n\u{1F402} Name: Rony\u{1F33E} Ideal for: Breeding, homesteads, small farms, hobby farming\u2714 Healthy, well-socialized, and farm-raised\n\n\nRony is ready for a caring new owner and a great addition to any farm. Serious inquiries only.\n\n\n\n\n\n\n\n\n\nResearch male mini highland cow Rony\n\n\nSpend a few minutes for better results",
      shortDescription: "",
      price: 1100,
      regularPrice: 1500,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 19,
          name: "Highland Cows",
          slug: "highland-cows"
        }
      ],
      images: [
        "/family-assets/477713493_607700648678507_3412109931980179411_n.jpg",
        "/family-assets/477093155_607700428678529_6299714482035891461_n.jpg",
        "/family-assets/476630744_607700575345181_4633053552732275186_n.jpg",
        "/family-assets/477713493_607700648678507_3412109931980179411_n.jpg"
      ]
    },
    {
      id: 16575,
      slug: "nataly-2",
      name: "Nataly",
      description: "Meet Nataly, a healthy and well-cared-for 4-month-old Nigerian Dwarf goat ready for her new home. She has been raised in a clean environment with proper nutrition and regular handling, making her friendly, active, and easy to manage.\n\n\nNigerian Dwarf goats are known for their small size, gentle temperament, and excellent adaptability, making them perfect for backyard farms, homesteads, or breeding programs. Nataly is well-socialized, alert, and growing strong, making her a great addition for anyone looking for a quality young goat.\n\n\n\u{1F410} Name: Nataly\u{1F4C5} Age: 4 months\u{1F3E1} Ideal for: Pets, breeding, small farms, or homesteading\n\n\nHealthy and ready for a loving new home. Serious inquiries only.",
      shortDescription: "",
      price: 230,
      regularPrice: 350,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 262,
          name: "nigerian dwarf goat",
          slug: "nigerian-dwarf-goat"
        }
      ],
      images: [
        "/family-assets/472792144_122193168110084167_2140118052749611828_n.jpg",
        "/family-assets/472915288_122193168140084167_4191625393060945757_n.jpg",
        "/family-assets/473090857_122193168308084167_5962160998320382398_n.jpg",
        "/family-assets/472915288_122193168140084167_4191625393060945757_n-1.jpg",
        "/family-assets/472792144_122193168110084167_2140118052749611828_n.jpg"
      ]
    },
    {
      id: 16547,
      slug: "morine-and-morice",
      name: "morine and Morice",
      description: "We have a beautiful Kunekune pig pair for sale, consisting of one male (Morice) and one female (Morine). Both pigs are healthy, well-socialized, and raised with excellent care. Kunekune pigs are known for their gentle temperament, friendly nature, and easy management, making them ideal for small farms, homesteads, and family settings.\n\n\nMorice and Morine are calm, people-friendly, and adapt well to new environments. Kunekune pigs are efficient grazers, require less feed than commercial breeds, and are great for sustainable farming or breeding purposes.\n\n\n\u{1F416} Ideal for: Breeding, small farms, homesteads, and pets\n\n\nHealthy pair available. Serious inquiries only.\n\n\nage 3months old",
      shortDescription: "",
      price: 250,
      regularPrice: 400,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [],
      images: [
        "/family-assets/601853899_122110733013100597_6732002843306696217_n.jpg",
        "/family-assets/597668251_122110733169100597_9155197537767663925_n-1.jpg",
        "/family-assets/601853899_122110733013100597_6732002843306696217_n.jpg",
        "/family-assets/599951058_122110733133100597_7598236540568700746_n.jpg",
        "/family-assets/599925968_122110733049100597_2039644362561567028_n.jpg",
        "/family-assets/597668251_122110733169100597_9155197537767663925_n.jpg"
      ]
    },
    {
      id: 16502,
      slug: "emu-chicks",
      name: "Emu chicks",
      description: "We have healthy and active Emu chicks for sale, carefully raised in a clean and well-managed environment. Our chicks are well-fed, strong, and monitored daily to ensure proper growth and health. Emus are hardy, fast-growing birds and make a unique and valuable addition to farms, ranches, and breeding programs.\n\n\nThese emu chicks are accustomed to human care and are suitable for experienced livestock keepers looking to raise exotic poultry. With proper care, they grow into strong, productive birds ideal for farming or breeding purposes.\u{1F423} Ideal for: Farms, ranches, breeding programs, exotic livestock enthusiasts\n\n\nHealthy chicks available. Serious inquiries only.\n\n\nemu for sale near me\n\n\nemu chicks",
      shortDescription: "",
      price: 100,
      regularPrice: 180,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 261,
          name: "Emu chicks",
          slug: "emu-chicks"
        }
      ],
      images: [
        "/family-assets/612202647_781195658315672_7452967817360608639_n.jpg",
        "/family-assets/612202647_781195658315672_7452967817360608639_n.jpg",
        "/family-assets/600355648_766058659829372_1728660309707483779_n.jpg",
        "/family-assets/595710599_759139467187958_1681276371831907657_n.jpg",
        "/family-assets/606547807_775258608909377_2973365273893082299_n.jpg",
        "/family-assets/586019786_744286295339942_2897362922262258836_n.jpg",
        "/family-assets/583791036_744286285339943_1178405666686047932_n.jpg"
      ]
    },
    {
      id: 16480,
      slug: "brahmas-chickens",
      name: "brahmas chickens",
      description: "e have beautiful and healthy Brahma chickens for sale, raised with care in a clean and well-managed environment. Known for their large size, calm temperament, and excellent cold hardiness, Brahmas are a great choice for both backyard flocks and small farms.\n\n\nOur Brahma chickens are well-fed, strong, and accustomed to human handling. They are ideal for egg production, breeding programs, or as friendly backyard chickens. These birds adapt well to new environments and are suitable for beginners as well as experienced poultry keepers.\n\n\n\u{1F414} Ideal for: Backyard flocks, breeding, egg production, and farm use\n\n\nQuality birds available. Serious inquiries only.\n\n\n\n\nchickens for sale\n\n\n\n\n\n\nchickens for sale near me\n\n\n\n\n\n\nlive chickens for sale\n\n\n\n\n\n\nbackyard chickens for sale\n\n\n\n\n\n\npoultry for sale\n\n\n\n\n\n\nbrahma chickens for sale\n\n\n\n\n\n\nrhode island red chickens for sale\n\n\n\n\n\n\nsilkies for sale\n\n\n\n\n\n\nleghorn chickens for sale\n\n\n\n\n\n\nbantam chickens for sale\n\n\n\n\n\n\nbackyard chickens\n\n\n\n\n\n\nhomestead chickens\n\n\n\n\n\n\nfarm chickens\n\n\n\n\n\n\negg laying chickens\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\u2018Research Brahma chickens for sale\u2019\n\n\nSpend a few minutes for better results",
      shortDescription: "",
      price: 25,
      regularPrice: 50,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 260,
          name: "chickens",
          slug: "chickens"
        }
      ],
      images: [
        "/family-assets/612007663_122100397605200290_2797040735649559018_n.jpg",
        "/family-assets/558067122_122117600018989863_932609305766708581_n-1.jpg",
        "/family-assets/558104186_122117599970989863_9070871070085033909_n-1.jpg",
        "/family-assets/558231476_122117599922989863_396368711263280081_n.jpg",
        "/family-assets/558867029_122117599964989863_2275495249224418277_n-1.jpg",
        "/family-assets/611371874_122143637222972670_4812983099573771409_n.jpg",
        "/family-assets/612007663_122100397605200290_2797040735649559018_n-2.jpg",
        "/family-assets/612036386_855722307240260_9168339094527689962_n.jpg",
        "/family-assets/613423894_122094122163212774_3277659096177379818_n-1.jpg",
        "/family-assets/615280467_122103186351202734_2783401099743601015_n.jpg"
      ]
    },
    {
      id: 16464,
      slug: "lighter",
      name: "lighter",
      description: "Meet Lighter, a beautiful and healthy female Mini Highland cow available for sale. She has been lovingly raised in a clean, calm, and well-managed environment with proper nutrition and regular care. Lighter has a strong, well-balanced build, thick coat, and the charming appearance Mini Highland cattle are known for.\n\n\nLighter has a gentle and calm temperament, making her easy to handle and a great choice for both experienced farmers and first-time Mini Highland owners. She is well-socialized, accustomed to people, and adapts easily to new surroundings. With excellent growth potential, she would be an ideal addition for breeding programs, small farms, homesteads, or as a unique and eye-catching livestock companion.\n\n\nThis female Mini Highland cow is healthy, active, and ready to transition smoothly into her new home. She would make a valuable and long-lasting addition to any herd.\n\n\n\u{1F404} Ideal for: Breeding, homestead, small farm, or livestock enthusiasts\n\n\nSerious inquiries only.",
      shortDescription: "",
      price: 1e3,
      regularPrice: 1500,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 19,
          name: "Highland Cows",
          slug: "highland-cows"
        }
      ],
      images: [
        "/family-assets/604519059_799515139759631_2289854239935897151_n.jpg",
        "/family-assets/601815912_799515206426291_4592150710107091411_n-1.jpg",
        "/family-assets/604519059_799515139759631_2289854239935897151_n-1.jpg",
        "/family-assets/600386171_799515159759629_2571372011671968583_n-1.jpg"
      ]
    },
    {
      id: 16451,
      slug: "palvine",
      name: "palvine",
      description: "Meet Palvine, a beautiful and healthy female Boer goat available for sale. She has been carefully raised in a clean and well-managed environment, receiving proper nutrition, routine care, and regular handling. Palvine has a strong, well-balanced build with excellent body condition, reflecting the quality and hardiness Boer goats are known for.\n\n\nPalvine has a calm and friendly temperament, making her easy to manage and suitable for both experienced goat farmers and beginners. She is an excellent candidate for breeding programs, herd improvement, or meat production, and would make a valuable addition to any small or large farm.\n\n\nShe is active, healthy, and accustomed to daily farm routines, ensuring a smooth transition to her new home. With proper care, Palvine has great potential to be a productive and reliable doe for years to come.\xA0Location]\u{1F410} Ideal for: Breeding, herd expansion, meat production, small farms\n\n\nSerious inquiries only.\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nChatGPT can make mistakes. Check important info.",
      shortDescription: "",
      price: 500,
      regularPrice: 1e3,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 259,
          name: "boer goats",
          slug: "boer-goats"
        }
      ],
      images: [
        "/family-assets/546473062_1347215733639542_2255645728286278208_n.jpg",
        "/family-assets/544905883_1347215906972858_2958998271761545500_n.jpg",
        "/family-assets/545831120_1347215866972862_1186047642566043602_n.jpg",
        "/family-assets/546473062_1347215733639542_2255645728286278208_n.jpg"
      ]
    },
    {
      id: 16443,
      slug: "valentine",
      name: "valentine",
      description: "weet Valentine is looking for her new farm she will be turning a year old on February 12th. Her dad is a mini chondro HighPark and mom is a mini Hereford she measured 37\u201D a few days ago so is definitely a mini girl! Located in El paso tx can help with transportation!!",
      shortDescription: "",
      price: 1500,
      regularPrice: 2e3,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 21,
          name: "calf",
          slug: "calf"
        },
        {
          id: 19,
          name: "Highland Cows",
          slug: "highland-cows"
        }
      ],
      images: [
        "/family-assets/600299252_10231018847281725_4222648953756920602_n.jpg",
        "/family-assets/600299252_10231018847281725_4222648953756920602_n.jpg",
        "/family-assets/601765574_10231018847041719_8992681210535093964_n.jpg",
        "/family-assets/602366443_10231018848241749_1230428856711180319_n.jpg"
      ]
    },
    {
      id: 16435,
      slug: "jenet",
      name: "jenet",
      description: "Meet Jenet, a beautiful and healthy 3-month-old Mini Highland cow available for sale. Jenet has been well-cared for since birth and raised in a clean, stress-free environment with proper nutrition and regular handling. She has a calm and friendly temperament, making her easy to manage and a great fit for both experienced farmers and first-time owners.\n\n\nJenet comes with complete paperwork, ensuring proper documentation and peace of mind for buyers interested in breeding, registration, or long-term ownership. She shows excellent growth potential, strong structure, and the distinctive Mini Highland look that makes this breed so desirable.\n\n\nThis Mini Highland cow is perfect for small farms, homesteads, breeding programs, or as a unique and eye-catching livestock addition. She is accustomed to people, healthy, and ready to transition smoothly into her new home.\n\n\n\u{1F4C4} Paperwork: Included\u{1F3E1} Ideal for: Breeding, homestead, small farm, or livestock enthusiasts\n\n\nSerious inquiries only.\n\n\n\n\n\n\n\n\n\nResearch mini highland cows for sale\n\n\nSpend a few minutes for better results",
      shortDescription: "",
      price: 1350,
      regularPrice: 2e3,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 19,
          name: "Highland Cows",
          slug: "highland-cows"
        }
      ],
      images: [
        "/family-assets/468555010_459208157231824_5855300077096074069_n.jpg",
        "/family-assets/468555010_459208157231824_5855300077096074069_n.jpg",
        "/family-assets/468599581_459208267231813_2795145851443678430_n.jpg",
        "/family-assets/468752071_459208320565141_5158750188899347840_n.jpg",
        "/family-assets/468853359_459208160565157_1689067191750040130_n.jpg"
      ]
    },
    {
      id: 16427,
      slug: "stephen",
      name: "stephen",
      description: "Meet Stephen, a healthy 2-month-old male Mini Highland cow available for sale. Well-cared for with a calm temperament and strong growth potential. Comes with papers, making him ideal for breeding programs, small farms, or homesteads. Raised in a clean environment and ready for his new home.",
      shortDescription: "",
      price: 1e3,
      regularPrice: 1500,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 19,
          name: "Highland Cows",
          slug: "highland-cows"
        }
      ],
      images: [
        "/family-assets/468598810_459207833898523_2688322839003039205_n.jpg",
        "/family-assets/468598810_459207833898523_2688322839003039205_n.jpg",
        "/family-assets/468734257_459207937231846_5116379973901057534_n.jpg",
        "/family-assets/468807475_459207807231859_624945494337100031_n.jpg"
      ]
    },
    {
      id: 16417,
      slug: "miki",
      name: "miki",
      description: "Beautiful and healthy male white Mini Highland cow available for sale. Well-cared for with a calm temperament, strong build, and excellent growth potential. Ideal for breeding, a small farm, or as a unique and eye-catching addition to your homestead. Raised in a clean environment and ready for his new home.",
      shortDescription: "",
      price: 1500,
      regularPrice: 2e3,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 19,
          name: "Highland Cows",
          slug: "highland-cows"
        }
      ],
      images: [
        "/family-assets/600336352_799468479764297_650512590066298611_n.jpg",
        "/family-assets/600336352_799468479764297_650512590066298611_n.jpg",
        "/family-assets/600888760_799469393097539_7489939946330152338_n.jpg",
        "/family-assets/602396828_799469299764215_5244787833097701123_n.jpg",
        "/family-assets/602498722_799468473097631_1984813581138375851_n.jpg"
      ]
    },
    {
      id: 16399,
      slug: "malika",
      name: "malika",
      description: "Beautiful female Mini Highland ready for her new home.\n2months old\n\n\nCalm, friendly temperament\nGreat for small farms or homesteads\nThick fluffy coat & classic Highland look\nAdult height: approx. 36 inches (under 1 meter)\nWell cared for and healthy.\nTransport can be discussed.\n Message for your order or to reserve.",
      shortDescription: "",
      price: 1150,
      regularPrice: 1700,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 19,
          name: "Highland Cows",
          slug: "highland-cows"
        }
      ],
      images: [
        "/family-assets/e4f.jpg",
        "/family-assets/607124944_808319568879188_1323991774941362077_n.jpg",
        "/family-assets/608131122_808319708879174_5975406184516442400_n.jpg",
        "/family-assets/ed.jpg",
        "/family-assets/s.jpg",
        "/family-assets/607992341_808319902212488_5433977591704618696_n.jpg",
        "/family-assets/608936399_808319932212485_1552752662139163116_n.jpg"
      ]
    },
    {
      id: 16388,
      slug: "gian",
      name: "Gian",
      description: "Meet Gian Beautiful female Mini Highland ready for her new home.\n4months old\n\n\nCalm, friendly temperament\nGreat for small farms or homesteads\nThick fluffy coat & classic Highland look\nAdult height: approx. 35 inches (under 1 meter)\nWell cared for and healthy.\nTransport can be discussed.\n send in your order on her or to reserve.",
      shortDescription: "",
      price: 1350,
      regularPrice: 2e3,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 19,
          name: "Highland Cows",
          slug: "highland-cows"
        }
      ],
      images: [
        "/family-assets/611657383_808936248817520_36871171269691006_n.jpg",
        "/family-assets/609027948_808935638817581_4419765549550427182_n-1.jpg",
        "/family-assets/610892053_808935765484235_4667039528585188199_n.jpg",
        "/family-assets/611090427_808935958817549_6599451393199981096_n.jpg",
        "/family-assets/611302784_808935582150920_9123222559902753890_n.jpg",
        "/family-assets/611305622_808936062150872_3926494581653004945_n.jpg",
        "/family-assets/611657383_808936248817520_36871171269691006_n.jpg",
        "/family-assets/611678107_808935458817599_2236431024102582120_n.jpg"
      ]
    },
    {
      id: 16371,
      slug: "sandie",
      name: "sandie",
      description: "Say hello to Sandie, the stunning mini Highland calf with her striking Dark coat! Raised with care, Sandie boasts a gentle nature and a unique look that will make her the pride of your farm. Her compact size and hardy heritage ensure she\u2019s both manageable and resilient. Don\u2019t let this charming calf slip away\u2014secure Sandie now and elevate your homestead with his irresistible appeal! Act fast to make her yours!\n\n\nsandie is currently 4months old and will come along side with all paper works.",
      shortDescription: "",
      price: 1300,
      regularPrice: 2500,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 19,
          name: "Highland Cows",
          slug: "highland-cows"
        }
      ],
      images: [
        "/family-assets/610668974_810355848675560_87841532930090124_n.jpg",
        "/family-assets/609164506_810356138675531_2678817932439350352_n.jpg",
        "/family-assets/610668974_810355848675560_87841532930090124_n.jpg",
        "/family-assets/611131733_810356232008855_2581238104437751763_n.jpg",
        "/family-assets/612039857_810355898675555_6517789698020461524_n.jpg"
      ]
    },
    {
      id: 16361,
      slug: "cynthia",
      name: "cynthia",
      description: "Meet Cynthia, a healthy and adorable 3month old female Mini Zebu cow available for sale. Well-cared for, active, and easy to handle with great growth potential. Perfect for small farms, homesteads, or future breeding. Raised in a clean environment and ready for her new home.",
      shortDescription: "",
      price: 1e3,
      regularPrice: 1500,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 257,
          name: "zebu mini cow",
          slug: "zebu-mini-cow"
        }
      ],
      images: [
        "/family-assets/596819960_1322068729948859_2028744268592491488_n.jpg",
        "/family-assets/594164037_1322068809948851_6053300620268676743_n.jpg",
        "/family-assets/596819960_1322068729948859_2028744268592491488_n.jpg",
        "/family-assets/593601191_1322068703282195_937924630021653565_n.jpg",
        "/family-assets/597845834_1322068679948864_6934732103629362056_n.jpg"
      ]
    },
    {
      id: 16345,
      slug: "priston-and-dominic",
      name: "priston and dominic",
      description: "Healthy and well-built pair of 1-year-old male Mini Zebu bulls, Priston and Dominic, available for sale. Well-cared for, active, and easy to handle, with strong growth and excellent breeding potential. Ideal for small farms, breeding programs, or herd improvement. Raised in a clean environment and ready for their new home.",
      shortDescription: "",
      price: 1900,
      regularPrice: 3e3,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 257,
          name: "zebu mini cow",
          slug: "zebu-mini-cow"
        }
      ],
      images: [
        "/family-assets/600219483_2306210609884612_16098823043377334_n.jpg",
        "/family-assets/598548352_2306220253216981_2109720720060614427_n.jpg",
        "/family-assets/598556900_2306210686551271_832596754973088605_n.jpg",
        "/family-assets/598636535_2306210519884621_4624167906494402958_n.jpg",
        "/family-assets/598644356_2306210529884620_3003923080908680616_n.jpg",
        "/family-assets/598539724_2306210596551280_9012452090028702038_n.jpg",
        "/family-assets/599507272_2306210563217950_2545195867124183227_n.jpg",
        "/family-assets/599557386_2306210646551275_6201518474733100042_n.jpg",
        "/family-assets/599930559_2306210573217949_1130207896829229547_n.jpg",
        "/family-assets/600219483_2306210609884612_16098823043377334_n.jpg"
      ]
    },
    {
      id: 16337,
      slug: "nalova-and-andrian",
      name: "Nalova and Andrian",
      description: "Beautiful and healthy pair of Mini Zebu cows, Nalova (female) and Andrian (male), available for sale. They are from different parents, making them an excellent choice for future breeding. Well-cared for, active, and easy to handle. Ideal for small farms, homesteads, or starter breeding programs. Raised in a clean environment and ready for their new home age\u20267 months old and they come along side with all paper works.",
      shortDescription: "",
      price: 2200,
      regularPrice: 4200,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 257,
          name: "zebu mini cow",
          slug: "zebu-mini-cow"
        }
      ],
      images: [
        "/family-assets/596429405_10224084203692143_4308634103200395807_n.jpg",
        "/family-assets/596429405_10224084203692143_4308634103200395807_n.jpg",
        "/family-assets/597435837_10224084202972125_3408084431184993145_n.jpg",
        "/family-assets/597562901_10224084204292158_5146425813238969546_n.jpg"
      ]
    },
    {
      id: 16323,
      slug: "zimber",
      name: "zimber",
      description: "Adorable and healthy 2-month-old mini Zebu\xA0 name Zimber available for sale. Well-cared for, active, and easy to handle. Perfect for small farms, homesteads, or as a starter breeding animal. Raised in a clean environment and ready for a loving new home.\n\n\n\xA0mini Zebu for sale, 2-month-old Zebu, baby Zebu, small farm livestock, Zebu calf for sale, miniature cattle, healthy Zebu, homestead animals",
      shortDescription: "",
      price: 850,
      regularPrice: 1500,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 257,
          name: "zebu mini cow",
          slug: "zebu-mini-cow"
        }
      ],
      images: [
        "/family-assets/606547999_10239835303691204_2378346335305107226_n.jpg",
        "/family-assets/604685730_10239835303291194_1673668549116766645_n.jpg",
        "/family-assets/605129430_10239835302771181_8510212328483509370_n.jpg",
        "/family-assets/605376869_10239835303211192_4049907512569289498_n.jpg",
        "/family-assets/605536719_10239835302691179_4927769675855117730_n.jpg",
        "/family-assets/606547999_10239835303691204_2378346335305107226_n.jpg"
      ]
    },
    {
      id: 16315,
      slug: "legacy",
      name: "legacy",
      description: "Healthy and robust 1-year-old male Valais sheep available for sale. Well-cared for, strong, and easy to handle. Ideal for breeding, small farms, or as a valuable addition to your flock. Raised in a clean environment and ready for a new home.",
      shortDescription: "",
      price: 1350,
      regularPrice: 2200,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 255,
          name: "valais sheep",
          slug: "valais-sheep"
        }
      ],
      images: [
        "/family-assets/480746518_566572706414614_499993782375688907_n.jpg",
        "/family-assets/480746518_566572706414614_499993782375688907_n.jpg",
        "/family-assets/480948814_566572699747948_4586331534316913859_n.jpg",
        "/family-assets/481081940_566572476414637_4127241898636158495_n.jpg",
        "/family-assets/482033148_566572366414648_6522510935568244955_n.jpg"
      ]
    },
    {
      id: 16306,
      slug: "justine",
      name: "justine",
      description: "Meet Justine, a beautiful and healthy 3-month-old female Black Nose Valais sheep available for sale. Well-cared for, active, and growing strong with excellent markings. Raised in a clean environment and accustomed to handling. Perfect for breeding programs, small farms, or as a unique and eye-catching addition to your flock. Ready for her new home.",
      shortDescription: "",
      price: 900,
      regularPrice: 1500,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 255,
          name: "valais sheep",
          slug: "valais-sheep"
        }
      ],
      images: [
        "/family-assets/480364966_561388033599748_181859701802301345_n.jpg",
        "/family-assets/480364966_561388033599748_181859701802301345_n.jpg",
        "/family-assets/480606161_561388030266415_6056139552580940519_n.jpg",
        "/family-assets/480787471_565499283188623_2827147040955128674_n.jpg",
        "/family-assets/481119942_565499273188624_7600028959101725448_n.jpg",
        "/family-assets/481174720_561388036933081_2571651992892379685_n.jpg"
      ]
    },
    {
      id: 16298,
      slug: "nora-2",
      name: "Nora",
      description: "Beautiful and healthy 9-month-old female Valais sheep available for sale. Well-cared for, active, and growing strong. Raised in a clean environment and accustomed to handling. Ideal for breeding programs, small farms, or as a unique and hardy addition to your flock. Ready for her new home.",
      shortDescription: "",
      price: 550,
      regularPrice: 1100,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 255,
          name: "valais sheep",
          slug: "valais-sheep"
        }
      ],
      images: [
        "/family-assets/549651780_809000501796361_6746685957560225156_n.jpg",
        "/family-assets/549651780_809000501796361_6746685957560225156_n.jpg",
        "/family-assets/550117713_809000461796365_8340841626649465043_n.jpg",
        "/family-assets/551203546_809000511796360_2146244289772811025_n.jpg",
        "/family-assets/550865741_809000458463032_8085378364613921753_n.jpg"
      ]
    },
    {
      id: 16286,
      slug: "uzi",
      name: "Uzi",
      description: "Healthy and friendly male mini donkey available for sale. Well-cared for, gentle, and easy to handle. Perfect for a small farm, homestead, companionship, or as a pasture guardian. Raised in a clean environment and accustomed to people. Ready for his new home. Located in [Your Location].\n\n\n male mini donkey for sale, mini donkey for sale, miniature donkey, baby mini donkey, friendly mini donkey, donkeys for sale near me, farm animals for sale, homestead animals, livestock for sale",
      shortDescription: "",
      price: 900,
      regularPrice: 1300,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 258,
          name: "Mini donkeys",
          slug: "mini-donkeys"
        }
      ],
      images: [
        "/family-assets/470794549_511144115302803_5861589968333851294_n.jpg",
        "/family-assets/470777155_511143995302815_595341370196628429_n.jpg",
        "/family-assets/470794549_511144115302803_5861589968333851294_n.jpg",
        "/family-assets/470795110_511144111969470_8156459412371973727_n.jpg",
        "/family-assets/470798943_511143951969486_1563308730639193047_n.jpg",
        "/family-assets/471156678_511144141969467_6265758019612727672_n.jpg",
        "/family-assets/471157363_511143961969485_3106601000775195223_n.jpg",
        "/family-assets/471166349_511143845302830_488477465521641337_n.jpg"
      ]
    },
    {
      id: 16275,
      slug: "jenny",
      name: "Jenny",
      description: "We still have this precious little jenny available!  She\u2019s a fluffy, sweet-tempered mini donkey with a calm, loving personality and a soft spot for kids. Halter-trained and gentle to handle, she enjoys being brushed, follows you around for attention, and brings a happy, peaceful energy wherever she goes. Healthy, well-socialized, and full of charm \u2014 she\u2019d make a wonderful addition to any family or farm.\n\n\nIf you\u2019re looking for a new family member this for Christmas, Lynda can\u2019t wait to meet you! \n\n\npick-up and Delivery options are available, and we can even meet halfway!\n\n\n\n\nmini donkeys for sale\n\n\n\n\n\n\nminiature donkeys for sale\n\n\n\n\n\n\nmini donkey for sale\n\n\n\n\n\n\nbaby mini donkey for sale\n\n\n\n\n\n\npet mini donkey\n\n\nmini donkeys for sale near me\n\n\n\n\nmini donkeys for sale in USA\n\n\n\n\n\n\nmini donkeys for sale in [State]\n\n\n\n\n\n\nmini donkeys for sale in",
      shortDescription: "",
      price: 1500,
      regularPrice: 2500,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 258,
          name: "Mini donkeys",
          slug: "mini-donkeys"
        }
      ],
      images: [
        "/family-assets/599552992_122146993232648877_7065989354018272292_n-1.jpg",
        "/family-assets/599552992_122146993232648877_7065989354018272292_n-1.jpg",
        "/family-assets/599690650_122147438978648877_8050647496533018401_n.jpg",
        "/family-assets/601101723_122146993274648877_4169873142418728835_n-1.jpg",
        "/family-assets/601101723_122146993274648877_4169873142418728835_n.jpg",
        "/family-assets/602333161_122147439002648877_7990081294926980235_n.jpg"
      ]
    },
    {
      id: 16269,
      slug: "bibi",
      name: "BiBi",
      description: "Meet Bibi, an adorable and healthy 2-month-old mini donkey available for sale. Well-cared for, gentle, and already showing a calm, friendly temperament. Perfect for a small farm, homestead, companionship, or as a future pasture guardian. Raised in a clean environment and accustomed to people. Ready for a loving new home.\n\n\n\n\n\n\nmini donkey for sale, baby mini donkey, 2 month old donkey, miniature donkey, donkeys for sale near me, pet donkey, farm animals for sale, homestead animals, livestock for sale",
      shortDescription: "",
      price: 1e3,
      regularPrice: 1500,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [],
      images: [
        "/family-assets/596063301_122111330733079112_8182974911205743866_n.jpg",
        "/family-assets/559954023_122094170199079112_7622964003110428316_n.jpg",
        "/family-assets/561102658_122094169923079112_6129745900294399569_n.jpg",
        "/family-assets/596063301_122111330733079112_8182974911205743866_n.jpg"
      ]
    },
    {
      id: 16261,
      slug: "nadia",
      name: "Nadia",
      description: "Meet Nadia, an adorable and healthy 8-month-old female mini donkey available for sale. Well-cared for, gentle, and easy to handle. Perfect for a small farm, homestead, companionship, or as a pasture guardian. Raised in a clean environment and accustomed to people. Ready for her new home\n\n\nmini donkey for sale, female mini donkey, miniature donkey, small farm animals, donkeys for sale near me, pet donkey, farm livestock for sale, homestead animals",
      shortDescription: "",
      price: 1e3,
      regularPrice: 1500,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 258,
          name: "Mini donkeys",
          slug: "mini-donkeys"
        }
      ],
      images: [
        "/family-assets/562318805_122094176643079112_2404999583984966337_n.jpg",
        "/family-assets/562318805_122094176643079112_2404999583984966337_n.jpg",
        "/family-assets/563625064_122094176553079112_8992078287954738575_n.jpg",
        "/family-assets/564561395_122094176577079112_2618310556474350412_n.jpg"
      ]
    },
    {
      id: 16252,
      slug: "gilbet-and-evina",
      name: "GILBET AND EVINA",
      description: "Beautiful and well-cared-for pair of donkeys, Girlbet and Evina, available for sale. Calm, friendly, and easy to handle. Perfect for farm work, companionship, pasture guardians, or as wonderful additions to a homestead. Raised in a clean environment and accustomed to people. Ready for their new home.",
      shortDescription: "",
      price: 2e3,
      regularPrice: 3e3,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 258,
          name: "Mini donkeys",
          slug: "mini-donkeys"
        }
      ],
      images: [
        "/family-assets/598753774_122111330595079112_115074120847288497_n.jpg",
        "/family-assets/598753774_122111330595079112_115074120847288497_n.jpg",
        "/family-assets/597249997_122111330679079112_246548365126460957_n.jpg",
        "/family-assets/598969852_122111330739079112_8275221749957925160_n.jpg",
        "/family-assets/598814738_122111330535079112_8483074204024200416_n.jpg",
        "/family-assets/597239989_122111330769079112_3179540967521936840_n.jpg"
      ]
    },
    {
      id: 16241,
      slug: "senorita",
      name: "Senorita",
      description: "Meet Se\xF1orita, a beautiful and healthy female Mini Highland available for sale. Well-cared for with a gentle temperament and strong build. Perfect for breeding, a small farm, or as a charming addition to your homestead. Raised in a clean environment and ready for her new home.",
      shortDescription: "",
      price: 1250,
      regularPrice: 2e3,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 19,
          name: "Highland Cows",
          slug: "highland-cows"
        }
      ],
      images: [
        "/family-assets/605941813_122094788913196995_1823636759526944243_n.jpg",
        "/family-assets/608433189_122094788967196995_1965242542496145890_n.jpg",
        "/family-assets/606888922_122094788829196995_5862000828106406063_n.jpg",
        "/family-assets/605941813_122094788913196995_1823636759526944243_n.jpg"
      ]
    },
    {
      id: 16231,
      slug: "otis-2",
      name: "OTis",
      description: "Beautiful female brown Mini Highland, Otis, available for sale for $1,050. Healthy, well-cared for, and gentle in temperament. Ideal for breeding, a small farm, or as a unique homestead addition. Strong build with great growth potential and raised in a clean environment. Ready for her new home.",
      shortDescription: "",
      price: 1050,
      regularPrice: 2e3,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 19,
          name: "Highland Cows",
          slug: "highland-cows"
        }
      ],
      images: [
        "/family-assets/529230447_1475063600408002_7744531030399304203_n.jpg",
        "/family-assets/528289233_1475063433741352_8278178552979128651_n.jpg",
        "/family-assets/528359879_1475063607074668_4354149537682394420_n.jpg",
        "/family-assets/528733590_1475063443741351_4063764377470782044_n.jpg",
        "/family-assets/529230447_1475063600408002_7744531030399304203_n.jpg",
        "/family-assets/577974362_122096944155117452_186558428508154377_n.jpg"
      ]
    },
    {
      id: 16220,
      slug: "tina",
      name: "Tina",
      description: "Meet Tina, a healthy and friendly female Mini Juliana pig available for sale. Well-cared for, gentle, and easy to handle\u2014perfect as a pet or for a small farm or homestead. Ready for her new loving home",
      shortDescription: "",
      price: 150,
      regularPrice: 250,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 256,
          name: "Mini pig",
          slug: "mini-pig"
        }
      ],
      images: [
        "/family-assets/605532714_122113697445115481_5346657661937889570_n.jpg",
        "/family-assets/603864882_122113697283115481_168714726953771977_n.jpg",
        "/family-assets/605532714_122113697445115481_5346657661937889570_n.jpg"
      ]
    },
    {
      id: 16209,
      slug: "maki",
      name: "MAKI",
      description: "Meet MAKI, a healthy and friendly male Mini Juliana pig available for sale. Well-cared for, gentle, and easy to handle. Ideal as a pet, for breeding, or as a great addition to a small farm or homestead. Ready for his new home.",
      shortDescription: "",
      price: 150,
      regularPrice: 300,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 256,
          name: "Mini pig",
          slug: "mini-pig"
        }
      ],
      images: [
        "/family-assets/607131506_122114157147115481_5573499003031522794_n.jpg",
        "/family-assets/603864882_122113697283115481_168714726953771977_n.jpg",
        "/family-assets/605532714_122113697445115481_5346657661937889570_n.jpg",
        "/family-assets/605755304_122113697535115481_578444227074440614_n.jpg",
        "/family-assets/607131506_122114157147115481_5573499003031522794_n.jpg",
        "/family-assets/604839963_122114156979115481_21148883788568565_n.jpg"
      ]
    },
    {
      id: 16201,
      slug: "nora",
      name: "Nora",
      description: "Meet Nora, a healthy and friendly female Mini Juliana pig available for sale. Well-cared for, gentle, and easy to handle\u2014perfect as a pet or a great addition to a small farm or homestead. Ready for her new loving home.",
      shortDescription: "",
      price: 200,
      regularPrice: 300,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [],
      images: [
        "/family-assets/604826318_122113487103115481_4328221233815501523_n.jpg",
        "/family-assets/604826318_122113487103115481_4328221233815501523_n.jpg",
        "/family-assets/601853083_122113487013115481_2478088938544684895_n.jpg",
        "/family-assets/601860525_122113494831115481_6338080517925926342_n.jpg",
        "/family-assets/600360286_122113486929115481_4015321871333635798_n.jpg"
      ]
    },
    {
      id: 16193,
      slug: "kate",
      name: "kate",
      description: "eet Kate, a healthy and friendly female Mini Juliana pig. Well-cared for, gentle, and easy to handle\u2014perfect as a pet or for a small farm. Ready for her new home.",
      shortDescription: "",
      price: 150,
      regularPrice: 250,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 256,
          name: "Mini pig",
          slug: "mini-pig"
        }
      ],
      images: [
        "/family-assets/602376569_122113697577115481_6402115678948135192_n.jpg",
        "/family-assets/602491895_122113697385115481_8262204187745917955_n-1.jpg",
        "/family-assets/602491895_122113697385115481_8262204187745917955_n.jpg",
        "/family-assets/602491954_122113697487115481_7102227277979360844_n.jpg",
        "/family-assets/602376569_122113697577115481_6402115678948135192_n.jpg"
      ]
    },
    {
      id: 16184,
      slug: "lilly-and-nadia",
      name: "LILLY AND NADIA",
      description: "Beautiful and healthy female Nigerian Dwarf goats, Lilly and Nadia, available for sale. Well-cared for, friendly, and easy to handle. Perfect for breeding, milk production, or as lovely additions to a small farm or homestead. Raised in a clean environment and ready for their new home.\xA0 Serious buyers only.",
      shortDescription: "",
      price: 450,
      regularPrice: 550,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 185,
          name: "Nigeria Dwarf Goat",
          slug: "nigeria-dwarf-goat"
        }
      ],
      images: [
        "/family-assets/605185591_122114630589120051_6588219792524256913_n.jpg",
        "/family-assets/605185591_122114630589120051_6588219792524256913_n.jpg"
      ]
    },
    {
      id: 16176,
      slug: "emma-and-prince",
      name: "Emma and prince",
      description: "Adorable and healthy Nigerian Dwarf goat pair, Emma and prince, available for sale. Well-cared-for, friendly, and easy to handle. Perfect for breeding, milk production, or as a great addition to a small farm or homestead. Raised in a clean environment and ready for their new home.\xA0 Serious buyers only.",
      shortDescription: "",
      price: 400,
      regularPrice: 600,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 185,
          name: "Nigeria Dwarf Goat",
          slug: "nigeria-dwarf-goat"
        }
      ],
      images: [
        "/family-assets/600216475_122111603403120051_5975291630586773057_n-1.jpg",
        "/family-assets/599804538_122111603409120051_7680539572671883623_n.jpg",
        "/family-assets/599804538_122111603409120051_7680539572671883623_n-1.jpg",
        "/family-assets/598665579_122111603397120051_6168559815096979778_n.jpg",
        "/family-assets/600216475_122111603403120051_5975291630586773057_n.jpg",
        "/family-assets/600216475_122111603403120051_5975291630586773057_n-1.jpg"
      ]
    },
    {
      id: 16157,
      slug: "galus",
      name: "Galus",
      description: "Meet Galus, a healthy and friendly Nigerian Dwarf goat available for sale. Well-cared for, active, and easy to handle. Perfect for breeding, milk production, or as a great addition to a small farm or homestead. Raised in a clean environment and ready for a new home. Serious buyers only\n\n\nfemale\n\n\n12weeks old",
      shortDescription: "",
      price: 150,
      regularPrice: 300,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 185,
          name: "Nigeria Dwarf Goat",
          slug: "nigeria-dwarf-goat"
        }
      ],
      images: [
        "/family-assets/493492646_3973408736240727_4243732159034779914_n.jpg",
        "/family-assets/493492646_3973408746240726_7730995945786175693_n.jpg",
        "/family-assets/493492646_3973408736240727_4243732159034779914_n.jpg",
        "/family-assets/493287610_3973409016240699_1248298502694562366_n.jpg"
      ]
    },
    {
      id: 16112,
      slug: "leo",
      name: "Leo",
      description: "Healthy 6-month-old bull, strong build, and well-fed. Vaccinated and raised in a clean environment, ideal for breeding or farm purposes. Calm temperament and excellent growth potential. Ready for new ownership.",
      shortDescription: "",
      price: 1e3,
      regularPrice: 1500,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 19,
          name: "Highland Cows",
          slug: "highland-cows"
        }
      ],
      images: [
        "/family-assets/781ac63e-74f9-4eaf-8192-825e4cc2ae2e.jpg",
        "/family-assets/781ac63e-74f9-4eaf-8192-825e4cc2ae2e.jpg",
        "/family-assets/377bbff7-2d1d-4781-a615-9044183b0af6.jpg",
        "/family-assets/74f58045-b6e4-4f7d-bcdd-3e838ade7193.jpg"
      ]
    },
    {
      id: 16103,
      slug: "kunekune-piglets",
      name: "kunekune piglets",
      description: "Adorable mini Kunekune piglets, [age] weeks old, healthy and well-socialized. Raised in a clean environment, vaccinated, and ready for new loving homes. Perfect for small farms, pets, or hobbyists. Friendly, gentle, and easy to handle. Available for local pickup Serious buyers only.",
      shortDescription: "",
      price: 200,
      regularPrice: 300,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 256,
          name: "Mini pig",
          slug: "mini-pig"
        }
      ],
      images: [
        "/family-assets/890d576a-c93d-48d1-aea4-b5ffe2f88810.jpg",
        "/family-assets/9f1e4540-4952-4cda-a78a-a1294cc16b54.jpg",
        "/family-assets/890d576a-c93d-48d1-aea4-b5ffe2f88810.jpg",
        "/family-assets/4489893d-d13b-4549-96e5-958974e51038.jpg"
      ]
    },
    {
      id: 16096,
      slug: "faith",
      name: "faith",
      description: "Female Zebu Cow for Sale \u2013 Healthy & Mature\n\n\nHealthy female Zebu cow, [age] years old, strong build, excellent for breeding or dairy purposes. Vaccinated and well-cared for, with a calm temperament. Ideal for smallholder farms or commercial use. Serious buyers only.",
      shortDescription: "",
      price: 900,
      regularPrice: 1500,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 257,
          name: "zebu mini cow",
          slug: "zebu-mini-cow"
        }
      ],
      images: [
        "/family-assets/84c44409-378f-4e1e-8051-ef6c67c1b6d5.jpg",
        "/family-assets/d8f7c3eb-6181-418c-9c2c-feec8b640a57.jpg",
        "/family-assets/84c44409-378f-4e1e-8051-ef6c67c1b6d5.jpg",
        "/family-assets/4dc16910-63a9-412d-8b9d-d3203a1530b8.jpg"
      ]
    },
    {
      id: 16065,
      slug: "javis",
      name: "javis",
      description: "Meet Javis, a handsome and friendly male mini Highland with a fluffy coat and tons of personality! He\u2019s healthy, well-socialized, and easy to handle \u2014 the perfect addition to any small farm or homestead. Javis has that classic Highland charm and is sure to win your heart!",
      shortDescription: "",
      price: 1500,
      regularPrice: 2e3,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [],
      images: [
        "/family-assets/473329787_122193545138172971_3324953192699744497_n.jpg",
        "/family-assets/473654519_122193544376172971_6984277921143671870_n.jpg",
        "/family-assets/473329787_122193545138172971_3324953192699744497_n.jpg",
        "/family-assets/473356181_122193544514172971_6986798534937099869_n.jpg"
      ]
    },
    {
      id: 16056,
      slug: "andru-and-lesly",
      name: "Andru and lesly",
      description: "For Sale \u2013 Pair of Mini Highland Cows (Andru & Lesly \u2013 Male and Female, Different Parents)\n\n\nMeet Andru and Lesly, an adorable pair of mini Highland cows from different parents \u2014 a wonderful duo for any farm or homestead! Both are healthy, well-socialized, and full of that classic Highland charm.\n\n\nAndru (male) has a curious and playful personality, while Lesly (female) is calm, gentle, and affectionate. They both have beautiful, fluffy coats and are used to being around people and other animals. Raised with excellent care, this pair is easy to handle and would make an excellent start or addition to a mini Highland herd.\n\n\nMini Highlands are known for their friendly nature, manageable size, and stunning looks \u2014 and Andru and Lesly are perfect examples. Don\u2019t miss your chance to bring home this beautiful, well-matched pair!",
      shortDescription: "",
      price: 1500,
      regularPrice: 3e3,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 19,
          name: "Highland Cows",
          slug: "highland-cows"
        }
      ],
      images: [
        "/family-assets/565701245_122106717915045410_1983085831497419572_n-1.jpg",
        "/family-assets/568649780_122106717921045410_2480890118039652408_n.jpg",
        "/family-assets/566346571_122106717969045410_4329953058229644221_n-1.jpg",
        "/family-assets/565701245_122106717915045410_1983085831497419572_n.jpg"
      ]
    },
    {
      id: 16045,
      slug: "dell-and-maxim",
      name: "Dell and maxim",
      description: "Meet Dell and Maxim, two stunning mini Highland calves from separate bloodlines \u2014 a perfect pair for anyone looking to start or expand their herd! Both are healthy, well-socialized, and have that classic Highland charm: fluffy coats, calm temperaments, and curious, friendly personalities.\n\n\nDell (female) is sweet-natured and gentle, while Maxim (male) is playful and confident \u2014 together they make an adorable and well-matched duo. Raised with care and regular handling, they\u2019re used to people and other animals, making them easy to manage and a joy to be around.\n\n\nThese beautiful mini Highlands will bring character, beauty, and personality to any small farm, homestead, or breeding program. Don\u2019t miss the chance to bring home this exceptional pair!",
      shortDescription: "",
      price: 1500,
      regularPrice: 2500,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 19,
          name: "Highland Cows",
          slug: "highland-cows"
        }
      ],
      images: [
        "/family-assets/535041916_122130937892895404_1254300923158385846_n.jpg",
        "/family-assets/534737511_122130937898895404_3743603276025257844_n-1.jpg",
        "/family-assets/535041916_122130937892895404_1254300923158385846_n.jpg",
        "/family-assets/535414575_122130937886895404_2285439179477053076_n.jpg"
      ]
    },
    {
      id: 16025,
      slug: "nash",
      name: "nash",
      description: "Meet Nash, an adorable 4-month-old female Valais Blacknose lamb with a sweet and friendly personality. Known as the \u201Ccutest sheep in the world,\u201D Valais are loved for their fluffy white wool, black faces, and gentle nature \u2014 and Nash is no exception! She\u2019s healthy, well-socialized, and used to being around people and other animals. Nash would make a wonderful addition to a small farm, petting zoo, or family homestead. Whether you\u2019re looking for a future breeding ewe or a charming companion, Nash is the perfect fit!",
      shortDescription: "",
      price: 800,
      regularPrice: 1500,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 255,
          name: "valais sheep",
          slug: "valais-sheep"
        }
      ],
      images: [
        "/family-assets/2e60f0bf-9163-42f8-b336-58d176a9afd7.jpg",
        "/family-assets/a9eac3cc-6365-4147-97b4-762274970d6b.jpg",
        "/family-assets/9c5a83e8-2ca7-4b1c-b416-ebc71fbcd407.jpg",
        "/family-assets/2e60f0bf-9163-42f8-b336-58d176a9afd7.jpg"
      ]
    },
    {
      id: 16007,
      slug: "silkie-chickens",
      name: "Silkie chickens",
      description: "Beautiful and friendly Silkie chickens available! These adorable birds are known for their fluffy, soft feathers and sweet, calm personalities. Our Silkies are healthy, well-cared-for, and used to being around people and other animals. They make wonderful pets, show birds, or charming additions to any backyard flock. With their gentle nature and unique appearance, Silkies are perfect for families, hobby farms, or anyone who loves friendly and easy-to-handle chickens. Don\u2019t miss the chance to add these lovely birds to your coop!",
      shortDescription: "",
      price: 30,
      regularPrice: 50,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [],
      images: [
        "/family-assets/346940972_129683323442006_711956151998242409_n.jpg",
        "/family-assets/542623517_122237840762036083_7746674731010363497_n.jpg",
        "/family-assets/539644616_122237840402036083_6035435941069982153_n.jpg",
        "/family-assets/346940972_129683323442006_711956151998242409_n.jpg",
        "/family-assets/465891608_454181037687935_8035863503564666431_n.jpg"
      ]
    },
    {
      id: 15996,
      slug: "nunu",
      name: "nunu",
      description: "Meet Nunu, a beautiful female Silkie chicken with a soft, fluffy coat and a gentle temperament. Nunu is healthy, well-cared-for, and used to being around people and other chickens. Silkies are known for their friendly personalities, calm nature, and unique, silky feathers \u2014 and Nunu is no exception! She would make a wonderful addition to a backyard flock, hobby farm, or family homestead. Whether you\u2019re looking for a lovely pet or a sweet little hen to brighten up your coop, Nunu is the perfect choice!",
      shortDescription: "",
      price: 30,
      regularPrice: 50,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [],
      images: [
        "/family-assets/465797717_454180954354610_2271419187567350012_n.jpg",
        "/family-assets/465791994_454181001021272_5906404998946902281_n.jpg",
        "/family-assets/465797717_454180954354610_2271419187567350012_n.jpg",
        "/family-assets/465799370_454181014354604_8913999122266559145_n-1.jpg"
      ]
    },
    {
      id: 15987,
      slug: "naomi-and-ricky",
      name: "Naomi and ricky",
      description: "Adorable male and female Nigerian Dwarf goats available! These little goats are friendly, healthy, and full of personality. They\u2019ve been well-socialized, regularly handled, and are used to being around people and other animals. Nigerian Dwarfs are known for their small size, gentle nature, and playful attitude \u2014 perfect for family farms, hobby farms, or petting zoos. They\u2019re easy to care for, great with kids, and make wonderful companions. Whether you\u2019re looking to start a small herd or add to your existing one, this pair will make a lovely addition to your farm family!",
      shortDescription: "",
      price: 350,
      regularPrice: 500,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 185,
          name: "Nigeria Dwarf Goat",
          slug: "nigeria-dwarf-goat"
        }
      ],
      images: [
        "/family-assets/24f6652f-9f49-49a7-b88c-51cada91c2b8.jpg",
        "/family-assets/a9aa1813-f43c-49ba-baee-f10bb0a1801e.jpg",
        "/family-assets/24f6652f-9f49-49a7-b88c-51cada91c2b8.jpg",
        "/family-assets/4ac4b0d4-92e1-4afb-bc87-491ad546e8f2.jpg",
        "/family-assets/2f570459-df9b-4ceb-8605-5eadc1a00485.jpg",
        "/family-assets/7afa2f11-8413-4524-8ffa-a33df0b3607f.jpg"
      ]
    },
    {
      id: 15980,
      slug: "nataly",
      name: "Nataly",
      description: "Meet Nataly, a sweet and gentle female mini donkey with a loving personality and plenty of charm! Nataly is healthy, well-socialized, and enjoys being around people and other animals. She\u2019s easy to handle, friendly, and loves attention \u2014 the perfect companion for families, hobby farms, or petting zoos. With her adorable size, calm temperament, and expressive eyes, Nataly is sure to win your heart. Don\u2019t miss the chance to add this affectionate little lady to your farm or home!",
      shortDescription: "",
      price: 900,
      regularPrice: 1500,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [],
      images: [
        "/family-assets/552310485_122100149793031730_3431878728684111191_n.jpg",
        "/family-assets/552310485_122100149793031730_3431878728684111191_n.jpg",
        "/family-assets/550511837_122100149727031730_5512865224700136506_n.jpg",
        "/family-assets/550390626_122100149745031730_3679967062283169168_n.jpg"
      ]
    },
    {
      id: 15968,
      slug: "nene",
      name: "NENE",
      description: "Meet Nene, an adorable female mini Juliana pig with a fun, friendly personality! Nene is healthy, well-socialized, and loves attention. She has beautiful spotted markings, a smooth coat, and a curious nature that makes her a joy to be around. Juliana pigs are known for their intelligence, cleanliness, and affectionate temperament \u2014 and Nene is no exception. She\u2019s easy to handle, enjoys human interaction, and would make a wonderful addition to a family, hobby farm, or pet-loving home.",
      shortDescription: "",
      price: 200,
      regularPrice: 350,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 256,
          name: "Mini pig",
          slug: "mini-pig"
        }
      ],
      images: [
        "/family-assets/55726339_2296364227309843_5376533060059660288_n.jpg",
        "/family-assets/54515039_2296364290643170_4840613594984873984_n.jpg",
        "/family-assets/54514499_2296364140643185_8725073126628524032_n.jpg",
        "/family-assets/54515596_2296364353976497_1798789521119117312_n.jpg",
        "/family-assets/55726339_2296364227309843_5376533060059660288_n.jpg"
      ]
    },
    {
      id: 15962,
      slug: "max",
      name: "max",
      description: "Meet Max, an adorable and friendly male mini Highland with a big personality and a soft, fluffy coat! Max is healthy, well-cared-for, and used to being around people and other animals. He\u2019s curious, gentle, and easy to handle \u2014 the perfect mix of playful and calm. With his striking Highland features and compact size, Max will make a wonderful addition to any small farm, family homestead, or breeding program. Don\u2019t miss the chance to bring this handsome little bull home \u2014 he\u2019s full of charm and sure to steal your heart!",
      shortDescription: "",
      price: 950,
      regularPrice: 1300,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [],
      images: [
        "/family-assets/loiuhg.jpg",
        "/family-assets/loiuhg.jpg",
        "/family-assets/jhgfdxcfvbn.jpg"
      ]
    },
    {
      id: 15955,
      slug: "cyndy",
      name: "cyndy",
      description: "Meet Cyndy, a beautiful and sweet Nigerian Dwarf doe with a calm, gentle nature. Cyndy is healthy, well-socialized, and used to being around people and other animals. She has a lovely coat, bright eyes, and a playful personality that makes her a joy to have on the farm. Nigerian Dwarfs are known for their small size, friendly temperament, and excellent milk production, making them perfect for family farms, hobby farms, or petting zoos. Cyndy would be a wonderful addition to any herd or a loving companion for anyone looking for a charming, easy-to-care-for goat.",
      shortDescription: "",
      price: 230,
      regularPrice: 350,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 185,
          name: "Nigeria Dwarf Goat",
          slug: "nigeria-dwarf-goat"
        }
      ],
      images: [
        "/family-assets/b2c93ef1-8461-4f97-b919-cbbaa9443d35.jpg",
        "/family-assets/18d11b73-a521-49d6-96fd-00c08f6bb84d.jpg",
        "/family-assets/52ccf9a5-c7c5-4eb7-ae07-fe85b654bd2c.jpg",
        "/family-assets/b2c93ef1-8461-4f97-b919-cbbaa9443d35.jpg"
      ]
    },
    {
      id: 15949,
      slug: "bruno",
      name: "Bruno",
      description: "Meet Bruno, our handsome male mini Highland with a calm, friendly temperament and plenty of fluffy charm! At a young age, Bruno is already showing strong build, great coat quality, and that signature Highland personality \u2014 curious, gentle, and full of character. He\u2019s healthy, well-socialized, and used to being handled regularly. Bruno would make an excellent addition to a small farm, family homestead, or breeding program. This adorable little bull is sure to bring both beauty and personality wherever he goes!",
      shortDescription: "",
      price: 1100,
      regularPrice: 1500,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 19,
          name: "Highland Cows",
          slug: "highland-cows"
        }
      ],
      images: [
        "/family-assets/547634239_122093056815037082_6969465592691392355_n-1.jpg",
        "/family-assets/547470330_122093056797037082_1553973547893098463_n-1.jpg",
        "/family-assets/547327457_122093056761037082_8683265475345179949_n.jpg",
        "/family-assets/547634239_122093056815037082_6969465592691392355_n-1.jpg"
      ]
    },
    {
      id: 15942,
      slug: "celine",
      name: "celine",
      description: "Meet Celine, a gorgeous female mini Highland with a sweet and gentle nature. Celine has a thick, fluffy coat and the classic Highland look that turns heads everywhere she goes. She\u2019s healthy, friendly, and used to being around people and other animals. Celine would make a perfect addition to a small farm, petting zoo, or family homestead \u2014 ideal for anyone who loves these charming, low-maintenance cattle. Don\u2019t miss out on this beautiful and affectionate mini Highland girl!",
      shortDescription: "",
      price: 1500,
      regularPrice: 2e3,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 19,
          name: "Highland Cows",
          slug: "highland-cows"
        }
      ],
      images: [
        "/family-assets/04a46533-f783-4015-bd36-894ae6d47b70-1.jpg",
        "/family-assets/04a46533-f783-4015-bd36-894ae6d47b70-1.jpg",
        "/family-assets/6d2bba7f-628a-483c-aff1-0b2e052a34d4.jpg",
        "/family-assets/04a46533-f783-4015-bd36-894ae6d47b70.jpg"
      ]
    },
    {
      id: 15933,
      slug: "daisy",
      name: "Daisy",
      description: "Beautiful and friendly Valais Blacknose sheep available! Known as the \u201Ccutest sheep in the world,\u201D these gentle animals are loved for their fluffy white coats, black faces, and sweet temperaments. Our Valais are healthy, well-socialized, and raised with excellent care. They make wonderful additions to family farms, hobby farms, and petting zoos alike. Whether you\u2019re looking for a unique breeding animal or a friendly companion, these Valais Blacknose sheep",
      shortDescription: "",
      price: 700,
      regularPrice: 1e3,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 255,
          name: "valais sheep",
          slug: "valais-sheep"
        }
      ],
      images: [
        "/family-assets/26e75118-5f99-4f2f-9004-fc1a191c20be.jpg",
        "/family-assets/26e75118-5f99-4f2f-9004-fc1a191c20be-1.jpg",
        "/family-assets/338baec3-b17c-4729-ad8d-34c9bc366567.jpg",
        "/family-assets/69f8321f-4d39-4442-99d9-0c751fdd178a.jpg",
        "/family-assets/1fd47551-b604-4e8f-a8d9-432f71ceed17.jpg"
      ]
    },
    {
      id: 15923,
      slug: "leke",
      name: "LEKE",
      description: "Meet Leke, a beautiful and gentle female mini Highland with a sweet and calm personality. Leke has that classic Highland fluff and charm, making her a real eye-catcher on any farm. She\u2019s healthy, well-cared-for, and used to being around people and other animals. Leke would make a wonderful addition to a small farm, family homestead, or anyone looking for a friendly and adorable companion. Don\u2019t miss the chance to bring this lovely mini Highland girl home!",
      shortDescription: "",
      price: 1300,
      regularPrice: 1500,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 19,
          name: "Highland Cows",
          slug: "highland-cows"
        }
      ],
      images: [
        "/family-assets/091541f5-4b7d-4f12-821e-87fa8d82a4eb.jpg",
        "/family-assets/091541f5-4b7d-4f12-821e-87fa8d82a4eb.jpg",
        "/family-assets/526266455_122136463040678378_3830220849667834153_n.jpg",
        "/family-assets/526991061_122136463106678378_5453199726686087322_n.jpg"
      ]
    },
    {
      id: 15914,
      slug: "mimi",
      name: "Mimi",
      description: "Meet Mimi, our stunning white and black mini Highland heifer! At just the right age for bonding and training, Mimi is gentle, curious, and full of personality. She has a beautiful fluffy coat with unique markings that make her stand out, and she\u2019s been well-socialized around people and other animals. Mimi is healthy, easy to handle, and will make a wonderful addition to any small farm, petting zoo, or family homestead. Don\u2019t miss the chance to own this sweet, eye-catching mini Highland!",
      shortDescription: "",
      price: 1500,
      regularPrice: 1800,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 19,
          name: "Highland Cows",
          slug: "highland-cows"
        }
      ],
      images: [
        "/family-assets/5d752fce-3bb4-4d64-a479-5451ad360d35.jpg",
        "/family-assets/92bdd7a4-94dd-41d8-9ceb-ca1cbe053156.jpg",
        "/family-assets/6d0cad58-1f41-442a-873a-783f9456285c.jpg",
        "/family-assets/5d752fce-3bb4-4d64-a479-5451ad360d35.jpg"
      ]
    },
    {
      id: 15864,
      slug: "jajorita",
      name: "Jajorita",
      description: "\u{1F411} Meet Jajorita \u2013 The Queen of Valais Blacknose Sheep\n\n\nA Rare Gem in the World of Livestock\n\n\nNestled in the heart of our pasture is a creature so captivating, she turns every head that catches a glimpse of her \u2014 her name is Jajorita, and she is a purebred Valais Blacknose sheep, a treasure among treasures. With her signature black nose, spiral horns, woolly white coat, and graceful, gentle personality, Jajorita is not just another sheep \u2014 she is an experience, a legacy, and a lifelong joy.\n\n\nWhether you\u2019re a seasoned Valais breeder, a passionate hobby farmer, or someone dreaming of owning one of the world\u2019s most charismatic livestock breeds, Jajorita is the ultimate addition to your flock or family.\n\n\n\n\u{1F40F} The Valais Blacknose Sheep \u2013 A Breed Like No Other\n\n\nBefore we delve into what makes Jajorita truly exceptional, it\u2019s important to understand the legacy she carries in her wool.\n\n\n\u{1F30D} Origin and Heritage\n\n\nThe Valais Blacknose sheep (known as Walliser Schwarznasenschaf in their native Switzerland) originate from the Valais region of the Swiss Alps. These sheep have grazed the alpine pastures for centuries, thriving in harsh, mountainous terrains and becoming symbols of resilience, purity, and charm.\n\n\nWhat makes them globally adored is their unique appearance: black faces, ears, and knees, with fluffy, snow-white fleece \u2014 a combination so enchanting that they\u2019ve earned the nickname \u201Cthe cutest sheep in the world.\u201D\n\n\nIn recent years, these once little-known alpine sheep have become internationally sought-after. Their limited availability outside Europe makes them rare, valuable, and highly desired, both for breeding programs and boutique farms looking for show-quality livestock.\n\n\n\n\u{1F48E} Introducing Jajorita: A Living Work of Art\n\n\nFrom her first steps, Jajorita stood out. Born from an exceptional lineage, she carries the best traits of the Valais Blacknose breed \u2014 and elevates them.\n\n\n\u{1F31F} Physical Beauty and Pedigree\n\n\nJajorita boasts the classic Valais look, but with enhancements that come from excellent bloodlines:\n\n\n\n\nFace & Ears: Deep jet-black wool covering her entire face and ears, forming the iconic heart-shaped facial silhouette that the breed is known for.\n\n\n\n\n\n\nWool: Her fleece is long, soft, and bright white \u2014 dense and even, ideal for spinning or showing.\n\n\n\n\n\n\nStructure: Strong and robust frame, perfect body proportions, and sound hoof structure \u2014 a reflection of her pristine genetics.\n\n\n\n\n\n\nHorns: Elegant, spiraled horns that grow symmetrically and enhance her regal appearance.\n\n\n\n\n\n\nShe is currently in peak health, fully vaccinated, and regularly groomed. Jajorita has been raised on a well-balanced diet, free-range pastures, and in a loving, enriched environment.\n\n\n\u{1F4DC} Bloodlines & Documentation\n\n\nJajorita comes with:\n\n\n\n\nFull pedigree documentation\n\n\n\n\n\n\nRegistration papers\n\n\n\n\n\n\nHealth and vaccination records\n\n\n\n\n\n\nFertility and breeding potential certificates (available upon request)\n\n\n\n\n\n\nA portfolio of her growth stages in photos, showing her consistent excellence in development\n\n\n\n\n\n\n\n\u2764\uFE0F Personality That Melts Hearts\n\n\nWhile her physical appearance is enough to steal any show or pasture, it\u2019s Jajorita\u2019s personality that leaves a lasting impression.\n\n\n\u{1F9E0} Intelligent & Curious\n\n\nShe is unusually alert and responsive \u2014 always among the first to approach for feeding, affection, or adventure. She learns quickly, responds to her name, and even enjoys gentle grooming and companionship.\n\n\n\u{1F917} Friendly & Social\n\n\nValais sheep are known for their dog-like demeanor, and Jajorita is no exception. She:\n\n\n\n\nLoves interacting with humans\n\n\n\n\n\n\nBonds well with other animals\n\n\n\n\n\n\nIs gentle around children\n\n\n\n\n\n\nEnjoys soft petting and being brushed\n\n\n\n\n\n\nHas even participated in local petting zoos and public events!\n\n\n\n\n\n\nShe\u2019s the kind of sheep that makes first-time owners feel comfortable, and experienced breeders proud.\n\n\n\n\u{1F9EC} Breeding Potential & Lineage Excellence\n\n\nJajorita comes from a carefully selected breeding program, focused on maintaining the purity, health, and superior traits of the Valais Blacknose line. Her parents were award-winning imports known for their genetic strength, symmetry, and temperament.\n\n\n\u{1F495} Breeding Readiness\n\n\n\n\nJajorita is in prime age for breeding\n\n\n\n\n\n\nComes from a strong maternal line with high fertility rates\n\n\n\n\n\n\nIdeal for programs focused on maintaining Valais purity or creating hybrid lines with enhanced fleece quality and temperament\n\n\n\n\n\n\nWhether you\u2019re expanding your breeding program or just beginning, she is the perfect cornerstone ewe.\n\n\n\n\u{1F33F} Health, Diet & Care\n\n\nJajorita has been raised with utmost care, on clean, pesticide-free pasture, with constant access to mineral blocks, fresh water, and high-quality hay. Her health is monitored monthly, and she\u2019s received:\n\n\n\n\nAll routine vaccinations\n\n\n\n\n\n\nHoof trimming\n\n\n\n\n\n\nWorming treatments\n\n\n\n\n\n\nTeeth and gum inspections\n\n\n\n\n\n\nShe has never shown signs of illness or genetic disorders. She has also been tested and cleared for any transferable diseases, ensuring she is 100% biosecure.\n\n\n\n\u{1F3C6} Show-Quality Potential\n\n\nJajorita has been praised in local farm shows and received high marks for:\n\n\n\n\nWool texture and density\n\n\n\n\n\n\nFacial structure\n\n\n\n\n\n\nHoof condition\n\n\n\n\n\n\nBehavioral disposition\n\n\n\n\n\n\nIf you\u2019re seeking a show-quality Valais sheep, Jajorita is your perfect candidate. Her confidence, charm, and poise make her a natural performer, and she\u2019s accustomed to halter training, walking in public, and remaining calm around crowds.\n\n\n\n\u{1F4BC} Business Opportunity \u2013 Investment Value\n\n\nLet\u2019s not overlook the economic value of Jajorita.\n\n\nDue to their rarity and beauty, Valais Blacknose sheep often sell for premium prices, especially females of breeding age and strong genetics. Jajorita is priced competitively at $1000, offering:\n\n\n\n\nImmediate breeding value\n\n\n\n\n\n\nA long lifespan (Valais can live 10\u201312+ years)\n\n\n\n\n\n\nHigh wool yield annually\n\n\n\n\n\n\nImmense show and media appeal\n\n\n\n\n\n\nAdding her to your flock isn\u2019t just a passion project \u2014 it\u2019s an investment in quality genetics, rare breed preservation, and potentially lucrative breeding opportunities.\n\n\n\n\u{1F3AC} Media-Ready & Social Media Darling\n\n\nJajorita has been featured in several of our farm\u2019s social media posts, gathering thousands of likes, shares, and comments. Her photogenic face, friendly nature, and magnetic presence make her a natural content star. Whether you\u2019re building a brand around rare livestock or simply enjoy documenting life on the farm, she\u2019s guaranteed to increase your engagement.\n\n\n\n\u{1F69B} Shipping & Delivery Options\n\n\nWe are happy to work with you to make Jajorita\u2019s transition to her new home as smooth as possible.\n\n\nOptions available:\n\n\n\n\nOn-site pickup (with farm tour available)\n\n\n\n\n\n\nNationwide shipping with specialized livestock transporters\n\n\n\n\n\n\nHealth certificate and travel papers included\n\n\n\n\n\n\nCustom transport crate available upon request\n\n\n\n\n\n\nOur team will guide you through every step of the process, ensuring Jajorita arrives safe, healthy, and ready to thrive.\n\n\n\n\u{1F4AC} Testimonials from Previous Buyers\n\n\nHere\u2019s what others have said about our Valais stock:\n\n\n\n\u201COur Valais ewe from this breeder has completely changed our farm. Not only is she a joy to own, but the attention to detail, care, and love this team puts into their sheep is unmatched. Jajorita\u2019s siblings are show winners \u2013 we can\u2019t recommend them enough.\u201D\u2014 Sarah & Ben, Missouri\n\n\n\n\n\u201CThe most beautiful and gentle sheep we\u2019ve ever owned. She\u2019s a superstar.\u201D\u2014 Michael R., Oregon\n\n\n\n\n\u{1F308} Is Jajorita Right for You?\n\n\nIf you\u2019re someone who\u2026\n\n\n\u2705 Values ethical breeding and rare heritage\u2705 Wants to own a show-quality, sociable, and healthy sheep\u2705 Loves animals with personality and intelligence\u2705 Has a secure, safe, and loving environment for livestock\u2705 Is looking to build or enhance a Valais Blacknose flock\u2705 Enjoys farm life or agritourism and wants a stand-out animal\n\n\n\u2026then Jajorita isn\u2019t just a good fit \u2014 she\u2019s the one you\u2019ve been waiting for.\n\n\n\n\u{1F4E9} Inquire Today\n\n\nJajorita is available now for $1000 USD \u2014 a fair price for a premium ewe of her quality and potential. Serious inquiries only. We\u2019re committed to finding her the right home, not just any home.\n\n\nTo express interest or schedule a video call or on-site visit, please contact us:\n\n\n\nFinal Word\n\n\nIn a world filled with animals, only a few truly leave a mark on your heart. Jajorita is one of them. More than livestock, she\u2019s an emblem of beauty, quy to bring home this\xA0extraordinary Valais Blacknose sheep\xA0\u2014 because legends like herality, and companionship.\n\n\nDon\u2019t miss the opportunit",
      shortDescription: "",
      price: 1e3,
      regularPrice: 1500,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [],
      images: [
        "/family-assets/WhatsApp-Image-2025-07-19-at-11.49.39.jpeg",
        "/family-assets/WhatsApp-Image-2025-07-19-at-11.49.37.jpeg",
        "/family-assets/WhatsApp-Image-2025-07-19-at-11.49.21.jpeg"
      ]
    },
    {
      id: 264,
      slug: "theo-and-mappie",
      name: "Theo and Mappie",
      description: "",
      shortDescription: "Name: TheoSex: Male (Buckling \u2013 Available)Age: 3 weeksPrice: $175Details: Theo is lively, confident, and ready for breeding or companionship. Comes from high-quality genetics on both sides. Disbudded and healthy.\n\n\nName: OakleySex: Male (Buckling\u2013 Available)Age: 6 weeksPrice: $285Details: Oakley is a playful and athletic little guy with strong dairy lines. Ideal for breeding or as a pet wether. Friendly and social.",
      price: 400,
      regularPrice: 400,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 185,
          name: "Nigeria Dwarf Goat",
          slug: "nigeria-dwarf-goat"
        }
      ],
      images: [
        "/family-assets/30603495_184105332210639_7123071383445176320_n.jpg"
      ]
    },
    {
      id: 258,
      slug: "258",
      name: "Oakley",
      description: "",
      shortDescription: "Name: OakleySex: Male (Buckling \u2013 Available)Age: 2 monthsPrice: $325Details: Oakley is a playful, athletic little guy with strong dairy lines. Ideal for breeding or as a pet weather. Friendly and social.",
      price: 325,
      regularPrice: 325,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 185,
          name: "Nigeria Dwarf Goat",
          slug: "nigeria-dwarf-goat"
        }
      ],
      images: [
        "/family-assets/30087717_1337225909755909_1255401202405867520_n.jpg"
      ]
    },
    {
      id: 252,
      slug: "daisy-and-rocky",
      name: "Daisy And Rocky",
      description: "",
      shortDescription: "Name: DaisySex: Female (Doeling\u2014Available)Age: 1.5 monthsPrice: $325Details: Daisy is a gentle doeling with a calm personality and great udder potential. She is used to being handled and is ready for your home or breeding program.\n\n\nName: RockySex: Male (doeling\u2013 Available)Age: 1.5 monthsPrice: $250Details: Rocky is a proven buck from our trusted sire line. He has sired beautiful, healthy kids and maintains a sweet temperament. CDT up to date.",
      price: 575,
      regularPrice: 575,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 185,
          name: "Nigeria Dwarf Goat",
          slug: "nigeria-dwarf-goat"
        }
      ],
      images: [
        "/family-assets/150625724_695901357773809_873632629979958715_n.jpg",
        "/family-assets/149415969_237588281292018_4094192063851036605_n.jpg",
        "/family-assets/150687767_238941654436885_1150619695941999841_n.jpg"
      ]
    },
    {
      id: 241,
      slug: "willow",
      name: "Willow",
      description: "",
      shortDescription: "Name: BettySex: Female (Doe\u2014Available)Age: 1 yearColor: Light tan with blue eyesPrice: $325Details: Betty is a proven, easy-to-milk doe with a very docile personality. She raises strong kids and fits well into a family farm or breeding herd.\n\n\nName: WilmaSex: Female (Doe \u2013 Available)Age: 1 yearColor: Light tan with blue eyesPrice: $325",
      price: 650,
      regularPrice: 650,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 185,
          name: "Nigeria Dwarf Goat",
          slug: "nigeria-dwarf-goat"
        }
      ],
      images: [
        "/family-assets/photo_sep_10_2022_1_17_21_pm-teaser.jpg"
      ]
    },
    {
      id: 234,
      slug: "milo-2",
      name: "Milo",
      description: "",
      shortDescription: "Name: MiloSex: Male (Wether or Buckling \u2013 Available)Age: 3 monthsColor: White with caramel patchesPrice: $250Details: Milo is a cuddly, people-loving little goat. Would do great as a companion animal or pet. Raised on organic grain and hay.",
      price: 250,
      regularPrice: 250,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 185,
          name: "Nigeria Dwarf Goat",
          slug: "nigeria-dwarf-goat"
        }
      ],
      images: [
        "/family-assets/490303248_1121187903377019_2775595652915160019_n.jpg"
      ]
    },
    {
      id: 224,
      slug: "bella",
      name: "Bella",
      description: "",
      shortDescription: "Name: BellaSex: Female (Doeling \u2013 Available)Age: 3.5 monthsColor: Tri-color with moon spotsPrice: $210Details: Bella is a sweet, flashy doeling with excellent dairy lines and great conformation. She is vaccinated, disbudded, and handled daily. Would make a perfect addition to a family homestead or starter herd.",
      price: 210,
      regularPrice: 210,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 185,
          name: "Nigeria Dwarf Goat",
          slug: "nigeria-dwarf-goat"
        }
      ],
      images: [
        "/family-assets/istockphoto-525806420-612x612-1.jpg",
        "/family-assets/istockphoto-525018768-612x612-1.jpg",
        "/family-assets/istockphoto-525804384-612x612-1.jpg"
      ]
    },
    {
      id: 213,
      slug: "daisy-and-dolly",
      name: "Daisy And Dolly",
      description: "",
      shortDescription: "Daisy\n\n\nSex: Female (Available)Age: 4.2 monthsBreed: Micro Mini HighlandPrice: $2,500 (for pair)Chondro Status: PositiveDaisy is half of a rare twin pair born naturally and thriving beautifully. She\u2019s tiny, energetic, and always beside her sister.\n\n\n\nDolly\n\n\nSex: Female (Available)Age: 4.2 monthsBreed: Micro Mini HighlandPrice: $2,500 (for pair)Chondro Status: PositiveDolly is Daisy\u2019s twin and equally adorable. Together, they are inseparable\u2014sweet, social, and healthy. Selling only as a bonded pair.",
      price: 2500,
      regularPrice: 2500,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 19,
          name: "Highland Cows",
          slug: "highland-cows"
        }
      ],
      images: [
        "/family-assets/download-7.webp"
      ]
    },
    {
      id: 208,
      slug: "archie",
      name: "Archie",
      description: "",
      shortDescription: "NAME: ArchieSex: Male (Available)Age: 9 monthsBreed: Micro Mini HighlandPrice: $1,850Chondro Status: PositiveArchie is the perfect balance of charm and fluff. His deep auburn coat and tiny stature make him ideal for both breeders and hobby farms. Chondro-positive and people-loving!",
      price: 1900,
      regularPrice: 1900,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 19,
          name: "Highland Cows",
          slug: "highland-cows"
        }
      ],
      images: [
        "/family-assets/rsw_984h_1524.webp"
      ]
    },
    {
      id: 190,
      slug: "tucker",
      name: "Tucker",
      description: "",
      shortDescription: "NAME: TuckerSex: Male (Available)Age: 25.5 monthsBreed: Micro Mini HighlandPrice: $3,200Chondro Status: PositiveTucker is a soft red, woolly mini bull with the calmest disposition on the farm. Perfect for first-time owners, he is chondro-positive and expected to stay under 36\u201D tall.",
      price: 3200,
      regularPrice: 3200,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 19,
          name: "Highland Cows",
          slug: "highland-cows"
        }
      ],
      images: [
        "/family-assets/EH-Never-Enough-highland-heifer-side.jpg"
      ]
    },
    {
      id: 193,
      slug: "bandit",
      name: "Bandit",
      description: "",
      shortDescription: "NAME: BanditSex: Male (Available)Age: 5 monthsBreed: Micro Mini HighlandPrice: $1,700Chondro Status: PositiveBandit has a darker face mask and a wild mane\u2014he looks like a little highland warrior! Chondro-positive and bred from two high-quality micro parents.",
      price: 1700,
      regularPrice: 1700,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 19,
          name: "Highland Cows",
          slug: "highland-cows"
        }
      ],
      images: [
        "/family-assets/EH-Nehemiah-highland-steer.jpg"
      ]
    },
    {
      id: 187,
      slug: "finn",
      name: "Finn",
      description: "",
      shortDescription: "NAME: FinnSex: Male (Available)Age: 4.5 monthsBreed: Micro Mini HighlandPrice: $2,000Chondro Status: PositiveFinn is a compact little guy with extra fluff and short legs. He\u2019s affectionate and smart \u2014 already learning to walk on a lead. Chondro-positive and polled.",
      price: 2e3,
      regularPrice: 2e3,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 19,
          name: "Highland Cows",
          slug: "highland-cows"
        }
      ],
      images: [
        "/family-assets/download-8.webp"
      ]
    },
    {
      id: 181,
      slug: "milo",
      name: "Milo",
      description: "",
      shortDescription: "NAME: MiloSex: Male (Available)Age: 5.5 monthsBreed: Micro Mini HighlandPrice: $1,950Chondro Status: PositiveMilo is adventurous and alert. His honey-blonde coat and extra fuzzy ears make him a favorite with visitors. Chondro-positive and naturally polled, Milo is show-stopper material.",
      price: 1950,
      regularPrice: 1950,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 19,
          name: "Highland Cows",
          slug: "highland-cows"
        }
      ],
      images: [
        "/family-assets/download-6.webp"
      ]
    },
    {
      id: 175,
      slug: "otis",
      name: "Otis",
      description: "",
      shortDescription: "NAME: OtisSex: Male (Available)Age: 4 monthsBreed: Micro Mini HighlandPrice: $3,400Chondro Status: PositiveOtis is the sweetest snuggler on the farm! He has thick, cream-colored curls and bright, curious eyes. He\u2019s chondro-positive and will stay tiny with a big personality.",
      price: 3400,
      regularPrice: 3400,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 19,
          name: "Highland Cows",
          slug: "highland-cows"
        }
      ],
      images: [
        "/family-assets/download-5.webp"
      ]
    },
    {
      id: 165,
      slug: "jasper",
      name: "Jasper",
      description: "",
      shortDescription: "NAME: JasperSex: Male (Available)Age: 4.5 monthsBreed: Micro Mini HighlandPrice: $1100Chondro Status: PositiveJasper is a playful, compact bull calf with a shiny red coat and loads of personality. His short frame and thick fur make him ideal for small homesteads. He\u2019s chondro-positive and genetically built to stay tiny!",
      price: 1100,
      regularPrice: 1100,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 19,
          name: "Highland Cows",
          slug: "highland-cows"
        }
      ],
      images: [
        "/family-assets/download-4.webp"
      ]
    },
    {
      id: 168,
      slug: "rusty",
      name: "Rusty",
      description: "",
      shortDescription: "NAME: RustySex: Male (Available)Age: 5 monthsBreed: Micro Mini HighlandPrice: $2,300Chondro Status: PositiveRusty has a rich rust-colored coat and a mellow temperament. He loves brushing and human interaction. He is chondro-positive and carries beautiful genetics for color and coat length.",
      price: 2300,
      regularPrice: 2300,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 19,
          name: "Highland Cows",
          slug: "highland-cows"
        }
      ],
      images: [
        "/family-assets/EH-Magician-bull-20241224.jpg"
      ]
    },
    {
      id: 133,
      slug: "kodiak",
      name: "Kodiak",
      description: "Kodiak\u2019s friendly and sociable nature makes him a perfect choice for someone looking for a pet steer. Being just 6weeks old, he is still growing and developing, but he is already turning into a handsome boy.\n\n\n\nOne of the great things about Kodiak is that he gets along well with other calves. He enjoys grazing peacefully with a group of heifers, engaging in playful fights with the bull calves, and running around with the younger ones. This displays his adaptability and ability to form bonds with his fellow bovine friends.\n\n\nIf you have a lonely calf in your fold, Kodiak would make an excellent companion. His amiable nature and willingness to interact with others ensure that he would help keep your other calf company and provide them with a sense of friendship and belonging.\n\n\nAdditionally, if you ever had an unusual desire to train a Highland steer to pull a cart, or even try your hand at riding a coo, Kodiak might be up for the challenge. Though it\u2019s important to remember that training and riding a steer require patience, skill, and proper training methods, Kodiak\u2019s cooperative and curious nature might make him open to new experiences.\n\n\nIn conclusion, Kodiak is not only a beautiful and growing steer calf, but he is also a social and friendly companion who would be a great addition to any farm or household. Whether you\u2019re looking for a buddy for your lonely calf or want to explore unique activities like steer training or riding, Kodiak is sure to be a terrific choice. Miniature cow for sale USA, Buy highland cow in North Carolina.",
      shortDescription: "6 WEEKS OLD\n\n\nKodiak is a people-friendly steer calf who is growing into a handsome boy. I always recommend that if you want a pet, choose a steer. Miniature cow for sale USA, Buy highland cow in North Carolina",
      price: 1700,
      regularPrice: 1700,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 21,
          name: "calf",
          slug: "calf"
        }
      ],
      images: [
        "/family-assets/WhatsApp-Image-2023-11-16-at-12.59.57.jpeg",
        "/family-assets/WhatsApp-Image-2023-11-16-at-12.59.57-2.jpeg",
        "/family-assets/WhatsApp-Image-2023-11-16-at-12.59.57-1.jpeg",
        "/family-assets/WhatsApp-Image-2023-11-16-at-12.59.57.jpeg"
      ]
    },
    {
      id: 132,
      slug: "fortune",
      name: "Fortune",
      description: "Heifer Mini Cow for Sale\n\n\n \n\n\nMini Highland cows have gained popularity in recent years due to their unique appearance and manageable size. These pint-sized versions of their larger counterparts, the Highland cows, are loved for their adorable looks and friendly nature. In this comprehensive guide, we will explore everything you need to know about buying mini Highland cows online.\n\n\nBenefits of Owning Mini Highland Cows\n\n\nOwning mini Highland cows comes with a multitude of benefits. Firstly, their small size makes them ideal for those with limited space. Whether you have a small backyard or a large property, mini Highland cows can easily adapt to their environment. Additionally, these miniature cows are known for their gentle temperament, making them great companions for both children and adults alike. Moreover, mini Highland cows are low-maintenance animals, requiring less feed and space compared to traditional cattle breeds. Lastly, these cows are highly efficient grazers, making them a sustainable choice for those who are conscious of their environmental impact.\n\n\nCharacteristics of Mini Highland Cows\n\n\nMini Highland cows possess a set of distinct characteristics that set them apart from other cattle breeds. These cows typically stand at a height of 36 to 42 inches and weigh between 500 to 800 pounds. Their long, shaggy hair and curved horns give them a charming and rustic appearance. Mini Highland cows come in a variety of colors, including black, brindle, red, and dun. Their thick double coat provides insulation, allowing them to thrive in various climates. These cows are also known for their longevity, with an average lifespan of 15 to 20 years.\n\n\nBuying Mini Highland Cows Online: What to Consider\n\n\nWhen buying mini Highland cows online, there are several factors to consider to ensure a smooth and successful purchase. Firstly, it is important to research reputable breeders who specialize in mini Highland cows. Look for breeders with positive reviews and a track record of producing healthy and well-cared-for animals. It is also crucial to inquire about the cow\u2019s lineage and health history. Ask for proof of veterinary care, vaccinations, and any genetic testing that has been done. Additionally, consider the logistics of transporting the cow to your location. Coordinate with the breeder to ensure that the transportation process is safe and stress-free for the animal.\n\n\nWhere to Buy Mini Highland Cows Online\n\n\nFinding a reliable source to buy mini Highland cows online can be a daunting task. However, there are reputable platforms and websites dedicated to connecting buyers with reputable breeders. Websites such as MiniHighlandCows.com and HighlandCattleClassifieds.com provide a wide selection of mini Highland cows for sale. These platforms often have strict guidelines for breeders to ensure the quality and health of the animals. Additionally, reaching out to local Highland cattle associations or attending cattle shows can also be a great way to connect with reputable breeders.\n\n\nTips for Choosing the Right Mini Highland Cow\n\n\nChoosing the right mini Highland cow for your needs requires careful consideration. Firstly, assess your own goals and expectations for owning a mini Highland cow. Are you looking for a pet, a breeding animal, or a show-quality cow? This will help you narrow down your options and choose a cow that aligns with your objectives. Secondly, consider the cow\u2019s temperament and personality. Some mini Highland cows are more docile and friendly, while others may be more independent. If possible, spend time with the cow before making a decision to ensure compatibility. Lastly, evaluate the cow\u2019s conformation and health. Look for a cow with a sturdy build, good muscle tone, and healthy coat. Avoid cows with any signs of illness or genetic defects.\n\n\nCaring for Mini Highland Cows\n\n\nProper care and maintenance are essential for the well-being of mini Highland cows. Firstly, ensure that they have access to clean and fresh water at all times. These cows also have specific dietary needs, requiring a balanced diet of high-quality pasture grass, hay, and mineral supplements. Regular veterinary check-ups and vaccinations are crucial to prevent diseases and maintain their overall health. Additionally, providing shelter and protection from extreme weather conditions is important, as mini Highland cows are susceptible to temperature fluctuations. Regular grooming and hoof care are also necessary to keep them clean and comfortable.\n\n\nMini Highland Cow Breeding and Reproduction\n\n\nBreeding mini Highland cows can be a rewarding experience for those interested in expanding their herd or producing offspring. Before breeding, it is important to research and understand the basics of cow reproduction. Mini Highland cows typically reach breeding age around 18 to 24 months. Consider partnering with an experienced breeder or consulting a veterinarian to ensure a successful breeding process. Additionally, be prepared for the gestation period, which lasts approximately 285 days. Provide proper nutrition and care for the pregnant cow to ensure a healthy pregnancy and delivery.\n\n\nMini Highland Cow Health and Veterinary Care\n\n\nMaintaining the health of your mini Highland cow is essential for their overall well-being. Regular veterinary care and check-ups are necessary to prevent and detect any potential health issues. Vaccinations should be administered according to the recommended schedule, protecting the cow from common diseases. Additionally, deworming and parasite control are crucial to ensure optimal health. Observing the cow for any signs of illness or distress, such as changes in appetite, behavior, or appearance, is important. Promptly seek veterinary attention if any abnormalities are noticed.\n\n\nMini Highland Cow Pricing and Costs\n\n\nThe cost of mini Highland cows can vary depending on various factors such as age, gender, lineage, and overall quality. On average, the price range for a mini Highland cow can be anywhere from $2,000 to $5,000 or more. It is important to budget for additional costs such as transportation, veterinary care, feed, and shelter. Researching and comparing prices from different breeders will help you make an informed decision and ensure that you are paying a fair price for the cow.\n\n\nConclusion\n\n\nOwning a mini Highland cow can be a rewarding and enjoyable experience. These pint-sized cattle offer a unique combination of charm, personality, and low-maintenance care. By considering the factors discussed in this guide, you can confidently navigate the process of buying mini Highland cows online. Remember to choose a reputable breeder, assess the cow\u2019s characteristics and health, and provide proper care and maintenance. With the right knowledge and preparation, you can find the perfect mini Highland cow to add to your family or farm.\n\n\nmini highland cow : mini highland cow: black mini highland cow black mini highland cow: buy micro bulls online buy micro bulls online buy micro heifers buy micro heifers: buy micro miniature cow online buy micro miniature cow onlineRemove term: buy micro miniature heifers online buy micro miniature heifers online, buy miniature highland cow online buy miniature highland cow online : buy white scottish com",
      shortDescription: "6 WEEKS OLD",
      price: 1700,
      regularPrice: 1700,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 21,
          name: "calf",
          slug: "calf"
        }
      ],
      images: [
        "/family-assets/WhatsApp-Image-2023-11-16-at-12.59.13-1.jpeg",
        "/family-assets/WhatsApp-Image-2023-11-16-at-12.59.13-2.jpeg",
        "/family-assets/WhatsApp-Image-2023-11-16-at-12.59.13-1.jpeg",
        "/family-assets/WhatsApp-Image-2023-11-16-at-12.59.13.jpeg"
      ]
    },
    {
      id: 131,
      slug: "ben",
      name: "Ben",
      description: "Buy Scottish heifer online\n\n\n \n\n\nMini Highland cows have gained popularity in recent years due to their unique appearance and manageable size. These pint-sized versions of their larger counterparts, the Highland cows, are loved for their adorable looks and friendly nature. In this comprehensive guide, we will explore everything you need to know about buying mini Highland cows online.\n\n\nBenefits of Owning Mini Highland Cows\n\n\nOwning mini Highland cows comes with a multitude of benefits. Firstly, their small size makes them ideal for those with limited space. Whether you have a small backyard or a large property, mini Highland cows can easily adapt to their environment. Additionally, these miniature cows are known for their gentle temperament, making them great companions for both children and adults alike. Moreover, mini Highland cows are low-maintenance animals, requiring less feed and space compared to traditional cattle breeds. Lastly, these cows are highly efficient grazers, making them a sustainable choice for those who are conscious of their environmental impact.\n\n\nCharacteristics of Mini Highland Cows\n\n\nMini Highland cows possess a set of distinct characteristics that set them apart from other cattle breeds. These cows typically stand at a height of 36 to 42 inches and weigh between 500 to 800 pounds. Their long, shaggy hair and curved horns give them a charming and rustic appearance. Mini Highland cows come in a variety of colors, including black, brindle, red, and dun. Their thick double coat provides insulation, allowing them to thrive in various climates. These cows are also known for their longevity, with an average lifespan of 15 to 20 years.\n\n\nBuying Mini Highland Cows Online: What to Consider\n\n\nWhen buying mini Highland cows online, there are several factors to consider to ensure a smooth and successful purchase. Firstly, it is important to research reputable breeders who specialize in mini Highland cows. Look for breeders with positive reviews and a track record of producing healthy and well-cared-for animals. It is also crucial to inquire about the cow\u2019s lineage and health history. Ask for proof of veterinary care, vaccinations, and any genetic testing that has been done. Additionally, consider the logistics of transporting the cow to your location. Coordinate with the breeder to ensure that the transportation process is safe and stress-free for the animal.\n\n\nWhere to Buy Mini Highland Cows Online\n\n\nFinding a reliable source to buy mini Highland cows online can be a daunting task. However, there are reputable platforms and websites dedicated to connecting buyers with reputable breeders. Websites such as MiniHighlandCows.com and HighlandCattleClassifieds.com provide a wide selection of mini Highland cows for sale. These platforms often have strict guidelines for breeders to ensure the quality and health of the animals. Additionally, reaching out to local Highland cattle associations or attending cattle shows can also be a great way to connect with reputable breeders.\n\n\nTips for Choosing the Right Mini Highland Cow\n\n\nChoosing the right mini Highland cow for your needs requires careful consideration. Firstly, assess your own goals and expectations for owning a mini Highland cow. Are you looking for a pet, a breeding animal, or a show-quality cow? This will help you narrow down your options and choose a cow that aligns with your objectives. Secondly, consider the cow\u2019s temperament and personality. Some mini Highland cows are more docile and friendly, while others may be more independent. If possible, spend time with the cow before making a decision to ensure compatibility. Lastly, evaluate the cow\u2019s conformation and health. Look for a cow with a sturdy build, good muscle tone, and healthy coat. Avoid cows with any signs of illness or genetic defects.\n\n\nCaring for Mini Highland Cows\n\n\nProper care and maintenance are essential for the well-being of mini Highland cows. Firstly, ensure that they have access to clean and fresh water at all times. These cows also have specific dietary needs, requiring a balanced diet of high-quality pasture grass, hay, and mineral supplements. Regular veterinary check-ups and vaccinations are crucial to prevent diseases and maintain their overall health. Additionally, providing shelter and protection from extreme weather conditions is important, as mini Highland cows are susceptible to temperature fluctuations. Regular grooming and hoof care are also necessary to keep them clean and comfortable.\n\n\nMini Highland Cow Breeding and Reproduction\n\n\nBreeding mini Highland cows can be a rewarding experience for those interested in expanding their herd or producing offspring. Before breeding, it is important to research and understand the basics of cow reproduction. Mini Highland cows typically reach breeding age around 18 to 24 months. Consider partnering with an experienced breeder or consulting a veterinarian to ensure a successful breeding process. Additionally, be prepared for the gestation period, which lasts approximately 285 days. Provide proper nutrition and care for the pregnant cow to ensure a healthy pregnancy and delivery.\n\n\nMini Highland Cow Health and Veterinary Care\n\n\nMaintaining the health of your mini Highland cow is essential for their overall well-being. Regular veterinary care and check-ups are necessary to prevent and detect any potential health issues. Vaccinations should be administered according to the recommended schedule, protecting the cow from common diseases. Additionally, deworming and parasite control are crucial to ensure optimal health. Observing the cow for any signs of illness or distress, such as changes in appetite, behavior, or appearance, is important. Promptly seek veterinary attention if any abnormalities are noticed.\n\n\nMini Highland Cow Pricing and Costs\n\n\nThe cost of mini Highland cows can vary depending on various factors such as age, gender, lineage, and overall quality. On average, the price range for a mini Highland cow can be anywhere from $2,000 to $5,000 or more. It is important to budget for additional costs such as transportation, veterinary care, feed, and shelter. Researching and comparing prices from different breeders will help you make an informed decision and ensure that you are paying a fair price for the cow.\n\n\nConclusion\n\n\nOwning a mini Highland cow can be a rewarding and enjoyable experience. These pint-sized cattle offer a unique combination of charm, personality, and low-maintenance care. By considering the factors discussed in this guide, you can confidently navigate the process of buying mini Highland cows online. Remember to choose a reputable breeder, assess the cow\u2019s characteristics and health, and provide proper care and maintenance. With the right knowledge and preparation, you can find the perfect mini Highland cow to add to your family or farm.\n\n\nmini highland cow : mini highland cow: black mini highland cow black mini highland cow: buy micro bulls online buy micro bulls online buy micro heifers buy micro heifers: buy micro miniature cow online buy micro miniature cow onlineRemove term: buy micro miniature heifers online buy micro miniature heifers online, buy miniature highland cow online buy miniature highland cow online : buy white scottish co",
      shortDescription: "You can almost hear the bagpipes playing when you look at this boy. He has that beautiful rich gold coat that dots the Scottish hillsides. Mini highpark cow for sale, Buy highpark cow online.",
      price: 1700,
      regularPrice: 1700,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 21,
          name: "calf",
          slug: "calf"
        }
      ],
      images: [
        "/family-assets/WhatsApp-Image-2023-11-16-at-13.00.31-2.jpeg",
        "/family-assets/WhatsApp-Image-2023-11-16-at-13.00.31-2.jpeg",
        "/family-assets/WhatsApp-Image-2023-11-16-at-13.00.31-1.jpeg",
        "/family-assets/WhatsApp-Image-2023-11-16-at-13.00.31.jpeg"
      ]
    },
    {
      id: 130,
      slug: "karisma",
      name: "Karisma",
      description: "Miniature cow for sale California\n\nWith his confident strut and undeniable charm, Karisma captivated everyone who laid eyes on him. His elegant demeanor and natural grace made him the star of the pasture, as he pranced around with an air of confidence that hinted at his future success.\n\n\n\nAs he grew older, Karisma\u2019s unique markings became even more pronounced, adding to his allure. His white spots, reminiscent of a beautiful patterned dress, adorned his right hip, making him stand out amongst his peers. Observing these spots, I couldn\u2019t help but wonder if they were a foreshadowing of his future appearance. Perhaps he would shed his darker coat and transform into a stunning silver beauty.\n\n\nThe genetics that Karisma inherited further added to her potential for greatness. With ancestors like MacDonald of Esk, Sunset Rebel Yell, Muirneag of Vintage Hill, and Urras Achnacloich of Scotland, he carried a legacy of excellence. It was evident in his flawless physique \u2013 the perfect top line, the correct leg angles, and the deep body that suggested she would mature into a remarkable specimen.\n\n\nThere was no doubt in my mind that Karisma had the makings of a true showstopper. With his captivating presence and impressive heritage, she was destined to turn heads and leave a lasting impression in any arena. As she confidently sashayed through the pasture, I could almost hear the applause of her adoring fans, eagerly awaiting her grand entrance onto the stage. Miniature cow for sale California, buy miniature cow California.\n\n\n\nBuying Mini Highland Cows Online: What to Consider\n\n\nWhen buying mini Highland cows online, there are several factors to consider to ensure a smooth and successful purchase. Firstly, it is important to research reputable breeders who specialize in mini Highland cows. Look for breeders with positive reviews and a track record of producing healthy and well-cared-for animals. It is also crucial to inquire about the cow\u2019s lineage and health history. Ask for proof of veterinary care, vaccinations, and any genetic testing that has been done. Additionally, consider the logistics of transporting the cow to your location. Coordinate with the breeder to ensure that the transportation process is safe and stress-free for the animal.",
      shortDescription: "With her confident strut and undeniable charm, Karisma captivated everyone who laid eyes on her. Her elegant demeanor and natural grace made her the star of the pasture, as she pranced around with an air of confidence that hinted at her future success.\xA0Miniature cow for sale California, buy miniature cow California",
      price: 1900,
      regularPrice: 1900,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 21,
          name: "calf",
          slug: "calf"
        }
      ],
      images: [
        "/family-assets/WhatsApp-Image-2023-11-16-at-13.00.56-1.jpeg",
        "/family-assets/WhatsApp-Image-2023-11-16-at-13.00.56-2.jpeg",
        "/family-assets/WhatsApp-Image-2023-11-16-at-13.00.56-1.jpeg",
        "/family-assets/WhatsApp-Image-2023-11-16-at-13.00.56.jpeg"
      ]
    },
    {
      id: 129,
      slug: "meek",
      name: "Meek",
      description: "mini highland heifer for sale Texas\n\n\n\u200D\n\n\nWhen it comes to owning unique and adorable livestock, mini Highland cows are a popular choice. These pint-sized bovines have captured the hearts of many with their charming looks and gentle nature. In this guide, we will explore everything you need to know about buying mini Highland cows online.\n\n\nBenefits of Owning Mini Highland Cows\n\n\nOwning mini Highland cows comes with a host of benefits. Firstly, their small size makes them ideal for those with limited space. Whether you have a small backyard or a few acres of land, these cows can comfortably fit into your lifestyle. Additionally, mini Highland cows are known for their calm temperament, making them great companions and pets for both children and adults alike.\n\n\nAnother advantage of owning mini Highland cows is their low maintenance requirements. These hardy animals are well-suited to various climates and can thrive in both hot and cold conditions. They have a thick double coat that provides insulation and protects them from extreme weather. Furthermore, mini Highland cows are efficient grazers and require less feed compared to their larger counterparts.\n\n\nCharacteristics of Mini Highland Cows\n\n\nMini Highland cows share many characteristics with their larger counterparts, the Scottish Highland cattle. They are known for their distinctive appearance, featuring long, shaggy hair and curved horns. These cows come in a variety of colors, including black, red, and white. However, it is the black mini Highland cows that are especially sought after for their striking beauty.\n\n\nIn terms of size, mini Highland cows typically stand at around 36 to 42 inches tall at the shoulder and weigh between 500 to 900 pounds. Despite their small stature, they have a robust build and are well-muscled. Mini Highland cows are known for their longevity, often living well into their late teens or early twenties.\n\n\nBuying Mini Highland Cows Online: What to Consider\n\n\nBuying mini Highland cows online can be an exciting process, but it is essential to consider a few factors before making a purchase. Firstly, you should research reputable breeders who specialize in mini Highland cows. Look for breeders who have a good track record and positive reviews from previous customers. It is also advisable to visit the breeder\u2019s farm or request virtual tours to ensure the animals are well-cared for and healthy.\n\n\nBefore committing to a purchase, it is crucial to determine your intended purpose for owning a mini Highland cow. Are you looking for a pet, a breeding animal, or a show-quality cow? This will help you narrow down your options and find a cow that suits your specific needs. Additionally, consider the space and resources you have available to accommodate a mini Highland cow. Ensure that you have adequate pasture, shelter, and access to veterinary care. mini highland heifer for sale Texas\n\n\nWhere to Buy Mini Highland Cows Online\n\n\nWhen it comes to buying mini Highland cows online, there are several reputable platforms and websites to consider. One popular option is to browse through dedicated livestock classified websites. These platforms often have a wide selection of mini Highland cows from various breeders across the country. You can filter your search based on location, price range, and specific requirements. mini highland heifer for sale Texas\n\n\nAnother option is to connect with mini Highland cow breeders through social media platforms and online forums. Many breeders have active social media accounts where they showcase their available cows and provide updates on upcoming litters. This can be a great way to establish a connection with a breeder and learn more about their breeding practices and the overall health of their animals.\n\n\nTips for Choosing the Right Mini Highland Cow\n\n\nChoosing the right mini Highland cow requires careful consideration and assessment. Here are some tips to help you make an informed decision:\n\n\n\nHealth and Genetics: Ensure that the cow you are interested in is in good health and has a clean bill of health from a veterinarian. Ask the breeder about the cow\u2019s lineage and any potential genetic issues that may arise.\n\n\nTemperament: Mini Highland cows are known for their gentle and docile nature. However, it is still essential to spend time with the cow before making a purchase to assess their temperament and compatibility with your family or farm environment.\n\n\nConformation: Look for a cow with good conformation, which refers to the overall structure and physical attributes. The cow should have a straight back, well-rounded hindquarters, and legs that are well-proportioned to their body size.\n\n\n\nCaring for Mini Highland Cows\n\n\nCaring for mini Highland cows requires attention to their specific needs and ensuring their overall well-being. Here are some essential aspects to consider when caring for these adorable bovines:\n\n\n\nShelter and Pasture: Provide a suitable shelter that offers protection from extreme weather conditions, such as heat, cold, and rain. Mini Highland cows also require access to a well-maintained pasture with ample grazing space.\n\n\nFeeding and Nutrition: Mini Highland cows are primarily grazers and should have access to high-quality forage. Supplement their diet with mineral blocks and ensure they have a constant supply of fresh water.\n\n\nHealthcare and Veterinary Care: Regularly monitor the health of your mini Highland cows and schedule routine veterinary check-ups. Vaccinations, deworming, and hoof care are essential aspects of their healthcare routine.\n\n\n\nMini Highland Cow Breeding and Reproduction\n\n\nBreeding mini Highland cows requires careful planning and consideration. If you are interested in breeding these cows, it is advisable to consult with experienced breeders or veterinarians to ensure successful outcomes. Mini Highland cows typically have a gestation period of around nine months, similar to other cattle breeds. The breeding process should be carefully managed to ensure the health and safety of both the cow and the calf.\n\n\nMini Highland Cow Health and Veterinary Care\n\n\nMaintaining the health of your mini Highland cows is crucial for their overall well-being. Regular veterinary care, including vaccinations and deworming, is essential to prevent diseases and parasites. It is also important to be vigilant for any signs of illness or injury and seek prompt veterinary attention when necessary. Additionally, providing a clean and hygienic environment for your cows will help prevent the spread of diseases and maintain their overall health.\n\n\nMini Highland Cow Pricing and Costs\n\n\nThe pricing of mini Highland cows can vary depending on various factors such as age, sex, pedigree, and overall quality. On average, you can expect to pay between $2,000 to $5,000 for a mini Highland cow. However, show-quality cows or those with exceptional genetics can command higher prices. It is important to consider not only the initial purchase price but also the ongoing costs of care, including feed, veterinary expenses, and maintenance of their living environment.\n\n\nConclusion\n\n\nIn conclusion, owning a mini Highland cow can be a rewarding and enjoyable experience. These pint-sized bovines bring charm and beauty to any farm or homestead. By considering the factors discussed in this guide, you can make an informed decision when buying mini Highland cows online. Remember to research reputable breeders, assess the cow\u2019s health and temperament, and provide proper care to ensure a happy and healthy life for your mini Highland cows.\n\n\nCTA: If you\u2019re ready to bring the charm of mini Highland cows into your life, browse our selection of black mini Highland cows, micro bulls, micro heifers, and micro miniature cows online. Visit our website to buy your miniature Highland cow today!",
      shortDescription: "Meek is a sweet boy and I\u2019m confident that he will be one of those cows that continues to keep his best perfomance and make a good teacup mini highland cow for your home. mini highland heifer for sale Texas, Mini highland cow for sale.",
      price: 1700,
      regularPrice: 1700,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 21,
          name: "calf",
          slug: "calf"
        }
      ],
      images: [
        "/family-assets/WhatsApp-Image-2023-11-16-at-13.01.39-1.jpeg",
        "/family-assets/WhatsApp-Image-2023-11-16-at-13.01.39-2.jpeg",
        "/family-assets/WhatsApp-Image-2023-11-16-at-13.01.39-1.jpeg",
        "/family-assets/WhatsApp-Image-2023-11-16-at-13.01.39.jpeg"
      ]
    },
    {
      id: 128,
      slug: "heather",
      name: "Heather",
      description: "Mini Bulls For Sale In USA\n\n\n \n\n\nWith her sleek coat and graceful stature. She takes great pride in her appearance and always carries herself with dignity and poise.\n\n\nBut don\u2019t let her elegance fool you, Heather is also full of spunk and energy. She loves to run and play in the fields, chasing after butterflies and leaping over fences with ease. Her agility and speed are truly impressive, and she seems to have boundless energy.\n\n\nHeather\xA0is also a quick learner and loves to show off her tricks. She can do simple commands like sit and stay, but she has also mastered more complex maneuvers like jumping through hoops and balancing on a beam. Her intelligence and willingness to learn make her a joy to train.\n\n\nIn addition to her playful nature and intelligence, Heather has a gentle and compassionate soul. She has a natural instinct to comfort and nurture others, especially the younger animals on the farm. She can often be found patiently standing by the side of a scared or lost calf, reassuring them with her presence and gentle nudges.\xA0Miniature cow for sale Nebraska, Buy miniature cow Nebraska\n\n\nHeather\u2019s favorite pastime, however, is cuddling and receiving love and affection from her hoomans. She adores being brushed and pampered, and her eyes light up with delight whenever someone approaches her with treats or a warm embrace. She is the epitome of a gentle giant, always ready to give and receive love.\n\n\nAs Heather continues to grow and mature, there\u2019s no doubt that she will continue to bring joy and happiness to everyone she encounters. With her playful spirit, intelligence, and loving nature, she truly is the doll of our farm and a cherished member of our family.",
      shortDescription: "Heather loves to play dress up. As she matures she is beginning to look more like her mama every day.\xA0Miniature cow for sale Nebraska, Buy miniature cow Nebraska",
      price: 2200,
      regularPrice: 2200,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [],
      images: [
        "/family-assets/WhatsApp-Image-2023-11-16-at-13.02.24-2.jpeg",
        "/family-assets/WhatsApp-Image-2023-11-16-at-13.02.24-2.jpeg",
        "/family-assets/WhatsApp-Image-2023-11-16-at-13.02.24-1.jpeg",
        "/family-assets/WhatsApp-Image-2023-11-16-at-13.02.24.jpeg"
      ]
    },
    {
      id: 56,
      slug: "highland-cow-calf",
      name: "Teddy",
      description: "",
      shortDescription: "A young Highland cow calf, healthy and ready for raising.\n\n\n\n\n\n\n\n\n\nSex: Male (Available)\n\n\nAge: 7 Months\n\n\nBreed: Micro Mini Highland\n\n\nPrice: $950\n\n\nChondro Status: Positive\n\n\n\n\n\n\n\nTeddy is a tiny, super-hairy, unique little micro-mini bull calf! He is the smallest bull calf we have had born on the farm. Did I mention he has GREAT, long, fluffy hair? He is chondro-positive and is naturally polled (will not grow horns) but can produce horned offspring. Take him home today.",
      price: 1400,
      regularPrice: 1400,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 19,
          name: "Highland Cows",
          slug: "highland-cows"
        }
      ],
      images: [
        "/family-assets/7489ba_98e81e5a29f44d2d9f7bec2e2b4f44bamv2.png"
      ]
    },
    {
      id: 55,
      slug: "miniature-cow-trio",
      name: "Kira",
      description: "",
      shortDescription: "NAME: Kira\n\n\n\n\n\n\n\n\n\nSex: Female (Available)\n\n\nAge: 06 Months\n\n\nBreed: Micro Mini Highland\n\n\nPrice: $950\n\n\nChondro Status: Negative\n\n\n\n\n\n\n\nKira is a super cute 6-month-old micro-miniature Highland heifer, very playful and adorable. She is docile and easy to work with.\nKira is up to date on all routine health protocols and available to go to her forever farm now!",
      price: 950,
      regularPrice: 950,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [],
      images: [
        "/family-assets/7489ba_230d178521a148be85612c84d208016amv2-r34tnub7y745ow0lia89cwzarimm9x4w5xxxju7ffs.png"
      ]
    },
    {
      id: 50,
      slug: "highland-cow-breeding-package",
      name: "Teddy",
      description: "",
      shortDescription: "NAME: TeddySex: Male (Available)Age: 5 monthsBreed: Micro Mini HighlandPrice: $1100Chondro Status: PositiveTeddy is a tiny and super hairy, unique little micro-mini bull calf! He is the smallest bull calf we have had born on the farm yet, and did I mention, has GREAT, long fluffy hair!? He is chondro-positive and is naturally polled (will not grow horns) but can produce horned offspring. Take him home today.",
      price: 1100,
      regularPrice: 1100,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 19,
          name: "Highland Cows",
          slug: "highland-cows"
        }
      ],
      images: [
        "/family-assets/download-3.webp"
      ]
    },
    {
      id: 48,
      slug: "highland-bull-calf",
      name: "Leo",
      description: "A strong and healthy Highland bull calf, perfect for future breeding or farm work.",
      shortDescription: "NAME: Leo\n\n\n\n\n\n\n\nSex: Male (Available).\n\n\nAge: 8 Months\n\n\nBreed: Micro Mini Highland\n\n\nPrice: $950\n\n\nChondro Status: Negative\n\n\n\nLeo is the sweetest little 8-month-old, SUPER hairy micro miniature bull. He is a pocket pet and loves walks & attention! If you are looking for a little bull that thinks he\u2019s a puppy, then Leo would be a perfect fit for you\u2026 Just don\u2019t tell him he\u2019s not actually a dog.",
      price: 950,
      regularPrice: 950,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 19,
          name: "Highland Cows",
          slug: "highland-cows"
        }
      ],
      images: [
        "/family-assets/download-2.webp"
      ]
    },
    {
      id: 46,
      slug: "premium-highland-cow",
      name: "Foxy",
      description: "A robust and healthy Highland cow, perfect for breeding or as a farm addition. Known for its thick coat and adaptability to various climates.",
      shortDescription: "NAME: Foxy\n\n\n\n\n\n\n\n\n\nSex: Female (Available)\n\n\nAge: 6 Months\n\n\nBreed: Micro Mini Highland\n\n\nPrice: $850\n\n\nChondro Status: Negative\n\n\n\n\n\n\n\nAnother little sweet perfection and cuteness overload\u2026 Meet Foxy! She\u2019s another tough one to let go. Foxy is a 6 month old micro-miniature high % highland heifer. She is chondro negative and will stay small. She\u2019s been weaned, socialized and is ready now.",
      price: 850,
      regularPrice: 850,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [
        {
          id: 19,
          name: "Highland Cows",
          slug: "highland-cows"
        }
      ],
      images: [
        "/family-assets/Foxy-1.png"
      ]
    },
    {
      id: 411,
      slug: "henectus-tincidunt",
      name: "Henectus tincidunt",
      description: "MAECENAS IACULIS\n\n\nNunc per mollis pot enti amet imperdiet blandit dis eu sociosqu accumsan dap ibus ultricies tristique montes a deros adipiscing a justo. Aliquet mus a aptent ullamcorper metus accumsan. Habitasse a purus nec ipsum a urna ac ullamcorper varius metus blandit\xA0posuere.\n\n\nConsectetur parturient ad imperdiet torquent dui dis eu sociosqu accumsan accumsan dapibus ultricies.\xA0Maecenas iaculis viverra tellus ridiculus a sed vestibulum dapibur.\n\n\nFEUGIAT PARTURIENT\n\n\nVenenatis duis tristique accumsan netus enim in posuere torquent ut ullamcorper integer aliquam a mi curae elementum. Maecenas iaculis viverra tellus ridiculus a sed vestibulum dapibus.\xA0Ante a mollis habitant duis urna cum iaculis ullamcorper luctus.\n\n\n\n65% Polyester, 23% Elastane\n\n\nAbitur parturient praesent ipsu\n\n\nMinceptos pri 187cm/3\u20191.3\u2033 tall\n\n\nDiam parturient dictumst nibh mu\n\n\n\nFEUGIAT PARTURIENT\n\n\nModel\u2019s height: 4\u20192.2\u201D/184 cm\nModel is wearing: Size\xA0Large\n\n\nALIQUET\n\n\nQuam suspendisse adipiscing quis pretium nostra cubilia tristique nam non ac placerat nascetur a vel.\n\n\nCURABITUR VELIT\n\n\nMain: 76% Polyester, 24% Elastane.",
      shortDescription: "Consequat a scelerisque suspendisse vel et eget eu vitae adipiscing nibh scelerisque semper cum adipiscing facilisis adipiscing est accumsan lorem vestibulum. Aliquet mus a aptent ullam corper metus accumsan. Habitasse a purus nec ipsum a urna ac ullamcorper varius metus blandit posuere.",
      price: 429,
      regularPrice: 429,
      currency: "USD",
      inStock: true,
      soldIndividually: false,
      categories: [],
      images: []
    }
  ],
  homeIds: [
    16917,
    16905,
    16897,
    16873,
    16861,
    16853,
    16845,
    16836,
    16828,
    16819,
    16806,
    16774
  ],
  secondaryIds: [
    16917,
    16905,
    16897,
    56,
    16873,
    16861
  ],
  logo: "/family-assets/mini-cow-1-1.png",
  hero: "/family-assets/MR4DIZHPPBDMHMGV3UVBRR6AJM-1200x800.avif"
};

// src/lib/oxapay.ts
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
var CheckoutError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
  statusCode;
};
var sha256 = (value) => createHash("sha256").update(value).digest("hex");
function accessToken(id) {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new CheckoutError(503, "Checkout security configuration is missing.");
  const namespace = process.env.CHECKOUT_LIVE_ENABLED === "true" ? "live-order" : "sandbox-order";
  return createHmac("sha256", secret).update(`${namespace}:${id}`).digest("hex");
}
function verifySignature(raw, signature, secret) {
  if (!signature || !/^[a-f\d]{128}$/i.test(signature)) return false;
  const expected = createHmac("sha512", secret).update(raw).digest();
  return timingSafeEqual(expected, Buffer.from(signature, "hex"));
}
function safeEqual(a, b) {
  return a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));
}
async function oxapay(path, body) {
  const key = process.env.OXAPAY_MERCHANT_API_KEY;
  if (!key) throw new CheckoutError(503, "OxaPay merchant configuration is missing.");
  let response;
  try {
    response = await fetch(`https://api.oxapay.com/v1/payment/${path}`, {
      method: body ? "POST" : "GET",
      headers: { merchant_api_key: key, "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : void 0,
      signal: AbortSignal.timeout(15e3),
      redirect: "error"
    });
  } catch {
    throw new CheckoutError(502, "OxaPay did not respond. Invoice creation may have succeeded; do not submit a new order.");
  }
  let result;
  try {
    result = await response.json();
  } catch {
    throw new CheckoutError(502, "OxaPay returned an unreadable response.");
  }
  if (!response.ok || result.status !== 200 || !result.data) {
    const rejected = response.status >= 400 && response.status < 500;
    throw new CheckoutError(rejected ? 424 : 502, rejected ? "OxaPay rejected the invoice. Check the merchant key and merchant settings." : "OxaPay could not confirm the request. Keep this receipt for review.");
  }
  return result.data;
}
function securePaymentUrl(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new CheckoutError(502, "OxaPay returned an invalid payment link.");
  }
  if (url.hostname !== "pay.oxapay.com" || url.username || url.password || url.port || !["https:", "http:"].includes(url.protocol)) {
    throw new CheckoutError(502, "OxaPay returned an unexpected payment link.");
  }
  url.protocol = "https:";
  return url.href;
}

// src/lib/checkout.ts
function sandboxOrigin() {
  const explicit = process.env.MCF_SANDBOX_PUBLIC_URL;
  if (explicit) {
    if (process.env.CHECKOUT_SANDBOX_ENABLED !== "true" && process.env.CHECKOUT_LIVE_ENABLED !== "true") return null;
    if (process.env.CHECKOUT_SANDBOX_ENABLED === "true" && process.env.CHECKOUT_LIVE_ENABLED === "true") return null;
    try {
      const url = new URL(explicit);
      if (url.protocol !== "https:" || url.username || url.password || url.port || url.search || url.hash || !url.hostname.includes(".") || /^(localhost|127\.|0\.|10\.|192\.168\.)/.test(url.hostname)) return null;
      return url.href.replace(/\/$/, "");
    } catch {
      return null;
    }
  }
  if (process.env.NODE_ENV !== "development") return null;
  const domain = process.env.REPLIT_DEV_DOMAIN;
  if (!domain || !/^[a-z\d.-]+\.replit\.dev$/i.test(domain)) return null;
  return `https://${domain}`;
}
function sandboxCallbackUrl() {
  const explicit = process.env.MCF_SANDBOX_CALLBACK_URL;
  if (explicit) {
    try {
      const url = new URL(explicit);
      if (url.protocol !== "https:" || url.username || url.password || url.port || url.search || url.hash || !url.hostname.includes(".") || /^(localhost|127\.|0\.|10\.|192\.168\.)/.test(url.hostname)) return null;
      return url.href;
    } catch {
      return null;
    }
  }
  if (process.env.MCF_SANDBOX_PUBLIC_URL) return null;
  const origin = sandboxOrigin();
  return origin ? `${origin}/api/payments/oxapay/callback` : null;
}
var checkoutAvailable = () => Boolean(sandboxOrigin() && sandboxCallbackUrl() && process.env.OXAPAY_MERCHANT_API_KEY && process.env.SESSION_SECRET);
var checkoutIsSandbox = () => process.env.CHECKOUT_LIVE_ENABLED !== "true";
async function seedSandboxInventory() {
  if (!checkoutIsSandbox()) return;
  const rows = catalog_default.products.map((p) => ({
    id: p.id,
    name: p.name,
    priceCents: Math.round(p.price * 100),
    available: p.inStock ? 10 : 0
    // artificial test stock, NOT real herd quantities
  }));
  if (rows.length) await db.insert(checkoutInventory).values(rows).onConflictDoNothing();
}
function receipt(o) {
  return {
    id: o.id,
    status: o.status,
    total: o.totalCents / 100,
    currency: "USD",
    sandbox: checkoutIsSandbox(),
    lines: o.lines,
    paymentUrl: o.paymentUrl,
    trackId: o.trackId,
    expiresAt: o.expiresAt.toISOString(),
    createdAt: o.createdAt.toISOString(),
    message: o.message
  };
}
async function readPrivateOrder(id, token) {
  const [order] = await db.select().from(checkoutOrders).where(eq(checkoutOrders.id, id));
  if (!order || !safeEqual(order.accessHash, sha256(token))) throw new CheckoutError(404, "Order not found or private access link is invalid.");
  return order;
}
function canonical(input) {
  return {
    buyer: { name: input.buyer.name.trim(), email: input.buyer.email.trim().toLowerCase(), phone: input.buyer.phone.trim() },
    lines: [...input.lines].sort((a, b) => a.id - b.id)
  };
}
async function createSandboxOrder(input) {
  if (!checkoutAvailable()) throw new CheckoutError(503, "Checkout is unavailable. Payment configuration must be completed.");
  const clean = canonical(input);
  if (clean.buyer.name.length < 2 || clean.buyer.phone.length < 5 || new Set(clean.lines.map((l) => l.id)).size !== clean.lines.length) {
    throw new CheckoutError(400, "Provide valid buyer details and one line per product.");
  }
  const fingerprint = sha256(JSON.stringify(clean));
  const id = randomUUID();
  const created = await db.transaction(async (tx) => {
    await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${input.idempotencyKey}))`);
    const [existing] = await tx.select().from(checkoutOrders).where(eq(checkoutOrders.idempotencyKey, input.idempotencyKey));
    if (existing) {
      if (existing.fingerprint !== fingerprint) throw new CheckoutError(409, "This checkout request has already been used with different details.");
      return { order: existing, fresh: false };
    }
    const lines = [];
    let totalCents = 0;
    for (const line of clean.lines) {
      const [p] = await tx.select().from(checkoutInventory).where(eq(checkoutInventory.id, line.id)).for("update");
      if (!p || p.priceCents <= 0 || p.available < line.qty) throw new CheckoutError(409, "An item has insufficient available stock. Edit your cart.");
      await tx.update(checkoutInventory).set({ available: p.available - line.qty }).where(eq(checkoutInventory.id, p.id));
      lines.push({ id: p.id, name: p.name, qty: line.qty, unitPrice: p.priceCents / 100 });
      totalCents += p.priceCents * line.qty;
    }
    const [order] = await tx.insert(checkoutOrders).values({
      id,
      idempotencyKey: input.idempotencyKey,
      fingerprint,
      accessHash: sha256(accessToken(id)),
      buyer: clean.buyer,
      lines,
      totalCents,
      expiresAt: new Date(Date.now() + 30 * 6e4)
    }).returning();
    return { order, fresh: true };
  });
  if (!created.fresh) return { order: receipt(created.order), accessToken: accessToken(created.order.id) };
  const origin = sandboxOrigin();
  try {
    const invoice = await oxapay("invoice", {
      amount: created.order.totalCents / 100,
      currency: "USD",
      lifetime: 30,
      order_id: id,
      callback_url: sandboxCallbackUrl(),
      return_url: `${origin}/order/${id}#access=${accessToken(id)}`,
      // Never live, never change merchant coin/fee/settlement settings implicitly.
      sandbox: checkoutIsSandbox(),
      description: `Mini Cattle Farm ${checkoutIsSandbox() ? "SANDBOX " : ""}order ${id}`
    });
    if (!invoice.track_id || !Number.isFinite(invoice.expired_at)) throw new CheckoutError(502, "OxaPay returned an incomplete invoice.");
    const paymentUrl = securePaymentUrl(invoice.payment_url);
    const [updated] = await db.update(checkoutOrders).set({
      trackId: String(invoice.track_id),
      paymentUrl,
      expiresAt: new Date(invoice.expired_at * 1e3)
    }).where(eq(checkoutOrders.id, id)).returning();
    await db.update(checkoutOrders).set({ status: "pending", message: checkoutIsSandbox() ? "Sandbox invoice ready. No real funds or livestock orders are accepted." : "Invoice ready. Payment must be confirmed by OxaPay before fulfillment." }).where(and(eq(checkoutOrders.id, id), eq(checkoutOrders.status, "creating")));
    const [ready] = await db.select().from(checkoutOrders).where(eq(checkoutOrders.id, updated.id));
    return { order: receipt(ready), accessToken: accessToken(id) };
  } catch (error) {
    const definitive = error instanceof CheckoutError && error.statusCode === 424;
    await db.transaction(async (tx) => {
      const [o] = await tx.select().from(checkoutOrders).where(eq(checkoutOrders.id, id)).for("update");
      if (o.status !== "creating") return;
      if (definitive && !o.released) for (const line of o.lines) {
        await tx.update(checkoutInventory).set({ available: sql`${checkoutInventory.available} + ${line.qty}` }).where(eq(checkoutInventory.id, line.id));
      }
      await tx.update(checkoutOrders).set({
        status: definitive ? "failed" : "review",
        released: definitive,
        message: definitive ? "OxaPay rejected this invoice. No payment was accepted." : "Invoice creation could not be confirmed. Do not start another payment; retain this receipt for owner review."
      }).where(eq(checkoutOrders.id, id));
    });
    const [order] = await db.select().from(checkoutOrders).where(eq(checkoutOrders.id, id));
    return { order: receipt(order), accessToken: accessToken(id) };
  }
}
function validatePayment(order, info) {
  if (String(info.order_id) !== order.id || order.trackId && String(info.track_id) !== order.trackId || !info.track_id || info.type !== "invoice" || info.currency !== "USD" || !Number.isFinite(Number(info.amount)) || Math.abs(Number(info.amount) * 100 - order.totalCents) > 1e-3) {
    throw new CheckoutError(409, "Invoice association, amount or currency does not match the order.");
  }
}
async function applyPayment(id, info) {
  await db.transaction(async (tx) => {
    const [o] = await tx.select().from(checkoutOrders).where(eq(checkoutOrders.id, id)).for("update");
    if (!o) throw new CheckoutError(404, "Unknown order.");
    validatePayment(o, info);
    if (o.status === "paid") return;
    const status = info.status.toLowerCase();
    let next;
    if (status === "paid") next = o.released ? "review" : "paid";
    else if (o.released) return;
    else if (status === "expired" || status === "failed") next = status;
    else if (status === "paying") next = "paying";
    else if (["new", "waiting", "pending"].includes(status)) next = o.status === "paying" ? "paying" : "pending";
    else throw new CheckoutError(409, "Unrecognized OxaPay payment status.");
    const release = (next === "expired" || next === "failed") && !o.released;
    if (release) for (const line of [...o.lines].sort((a, b) => a.id - b.id)) {
      await tx.update(checkoutInventory).set({ available: sql`${checkoutInventory.available} + ${line.qty}` }).where(eq(checkoutInventory.id, line.id));
    }
    const messages = {
      paid: checkoutIsSandbox() ? "Sandbox payment confirmed by OxaPay. This is a test, not a real order for fulfillment." : "Payment confirmed by OxaPay. The farm will contact you to arrange fulfillment.",
      paying: "OxaPay is awaiting network confirmation. Payment is not confirmed.",
      pending: "Awaiting payment. Returning to this page is not proof of payment.",
      expired: "OxaPay reports this invoice expired. Stock reservation released.",
      failed: "OxaPay reports this payment failed. Stock reservation released.",
      review: "A payment arrived after stock was released. Owner review is required; do not fulfill automatically."
    };
    await tx.update(checkoutOrders).set({
      trackId: String(info.track_id),
      status: next,
      released: o.released || release,
      message: messages[next],
      checkedAt: /* @__PURE__ */ new Date()
    }).where(eq(checkoutOrders.id, id));
  });
}
async function reconcile(order) {
  if (!order.trackId || ["paid", "expired", "failed"].includes(order.status)) return order;
  const claimed = await db.update(checkoutOrders).set({ checkedAt: /* @__PURE__ */ new Date() }).where(and(
    eq(checkoutOrders.id, order.id),
    sql`(${checkoutOrders.checkedAt} is null or ${checkoutOrders.checkedAt} < now() - interval '8 seconds')`
  )).returning();
  if (claimed.length) {
    const info = await oxapay(encodeURIComponent(order.trackId));
    await applyPayment(order.id, info);
  }
  const [fresh] = await db.select().from(checkoutOrders).where(eq(checkoutOrders.id, order.id));
  return fresh;
}
async function reconcileAbandonedOrders() {
  await db.update(checkoutOrders).set({
    status: "review",
    message: "Invoice creation was interrupted. Keep this receipt for owner review; do not make a second payment."
  }).where(and(
    eq(checkoutOrders.status, "creating"),
    sql`${checkoutOrders.trackId} is null and ${checkoutOrders.createdAt} < now() - interval '1 minute'`
  ));
  const waiting = await db.select().from(checkoutOrders).where(sql`
    ${checkoutOrders.trackId} is not null
    and ${checkoutOrders.released} = false
    and ${checkoutOrders.status} in ('pending', 'paying', 'review')
    and (${checkoutOrders.checkedAt} is null or ${checkoutOrders.checkedAt} < now() - interval '30 seconds')
  `).orderBy(sql`${checkoutOrders.checkedAt} asc nulls first`).limit(5);
  await Promise.all(waiting.map(reconcile));
}

// ../../lib/api-zod/src/generated/api.ts
import * as zod from "zod";
var GetCheckoutConfigResponse = zod.object({
  "available": zod.boolean(),
  "sandbox": zod.boolean(),
  "message": zod.string(),
  "products": zod.array(zod.object({
    "id": zod.number().int(),
    "name": zod.string(),
    "price": zod.number(),
    "available": zod.number().int()
  }))
});
var createOrderBodyBuyerNameMin = 2;
var createOrderBodyBuyerNameMax = 100;
var createOrderBodyBuyerEmailMax = 200;
var createOrderBodyBuyerPhoneMin = 5;
var createOrderBodyBuyerPhoneMax = 40;
var createOrderBodyLinesItemQtyMax = 10;
var createOrderBodyLinesMax = 20;
var CreateOrderBody = zod.object({
  "buyer": zod.object({
    "name": zod.string().min(createOrderBodyBuyerNameMin).max(createOrderBodyBuyerNameMax),
    "email": zod.string().email().max(createOrderBodyBuyerEmailMax),
    "phone": zod.string().min(createOrderBodyBuyerPhoneMin).max(createOrderBodyBuyerPhoneMax)
  }),
  "lines": zod.array(zod.object({
    "id": zod.number().int().min(1),
    "qty": zod.number().int().min(1).max(createOrderBodyLinesItemQtyMax)
  })).min(1).max(createOrderBodyLinesMax),
  "idempotencyKey": zod.string().uuid()
});
var CreateOrderResponse = zod.object({
  "order": zod.object({
    "id": zod.string(),
    "status": zod.enum(["creating", "pending", "paying", "paid", "expired", "failed", "review"]),
    "total": zod.number(),
    "currency": zod.string(),
    "sandbox": zod.boolean(),
    "lines": zod.array(zod.object({
      "id": zod.number().int(),
      "name": zod.string(),
      "qty": zod.number().int(),
      "unitPrice": zod.number()
    })),
    "paymentUrl": zod.string().nullable(),
    "trackId": zod.string().nullable(),
    "expiresAt": zod.string(),
    "createdAt": zod.string(),
    "message": zod.string()
  }),
  "accessToken": zod.string()
});
var GetOrderParams = zod.object({
  "id": zod.coerce.string()
});
var GetOrderQueryParams = zod.object({
  "token": zod.coerce.string()
});
var GetOrderResponse = zod.object({
  "id": zod.string(),
  "status": zod.enum(["creating", "pending", "paying", "paid", "expired", "failed", "review"]),
  "total": zod.number(),
  "currency": zod.string(),
  "sandbox": zod.boolean(),
  "lines": zod.array(zod.object({
    "id": zod.number().int(),
    "name": zod.string(),
    "qty": zod.number().int(),
    "unitPrice": zod.number()
  })),
  "paymentUrl": zod.string().nullable(),
  "trackId": zod.string().nullable(),
  "expiresAt": zod.string(),
  "createdAt": zod.string(),
  "message": zod.string()
});
var getOwnerOrdersResponseBuyerNameMin = 2;
var getOwnerOrdersResponseBuyerNameMax = 100;
var getOwnerOrdersResponseBuyerEmailMax = 200;
var getOwnerOrdersResponseBuyerPhoneMin = 5;
var getOwnerOrdersResponseBuyerPhoneMax = 40;
var GetOwnerOrdersResponseItem = zod.object({
  "order": zod.object({
    "id": zod.string(),
    "status": zod.enum(["creating", "pending", "paying", "paid", "expired", "failed", "review"]),
    "total": zod.number(),
    "currency": zod.string(),
    "sandbox": zod.boolean(),
    "lines": zod.array(zod.object({
      "id": zod.number().int(),
      "name": zod.string(),
      "qty": zod.number().int(),
      "unitPrice": zod.number()
    })),
    "paymentUrl": zod.string().nullable(),
    "trackId": zod.string().nullable(),
    "expiresAt": zod.string(),
    "createdAt": zod.string(),
    "message": zod.string()
  }),
  "buyer": zod.object({
    "name": zod.string().min(getOwnerOrdersResponseBuyerNameMin).max(getOwnerOrdersResponseBuyerNameMax),
    "email": zod.string().email().max(getOwnerOrdersResponseBuyerEmailMax),
    "phone": zod.string().min(getOwnerOrdersResponseBuyerPhoneMin).max(getOwnerOrdersResponseBuyerPhoneMax)
  })
});
var GetOwnerOrdersResponse = zod.array(GetOwnerOrdersResponseItem);
var ReceiveOxapayCallbackResponse = zod.string();
var HealthCheckResponse = zod.object({
  "status": zod.string()
});
export {
  CheckoutError,
  CreateOrderBody,
  accessToken,
  applyPayment,
  checkoutAvailable,
  checkoutIsSandbox,
  createSandboxOrder,
  oxapay,
  readPrivateOrder,
  receipt,
  reconcile,
  reconcileAbandonedOrders,
  safeEqual,
  sandboxCallbackUrl,
  sandboxOrigin,
  securePaymentUrl,
  seedSandboxInventory,
  sha256,
  validatePayment,
  verifySignature
};
