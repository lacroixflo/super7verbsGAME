export const verbs = {
  'est': { infinitive: 'être', translation: 'to be', emoji: '🧑' },
  'a': { infinitive: 'avoir', translation: 'to have', emoji: '🎁' },
  'va': { infinitive: 'aller', translation: 'to go', emoji: '🚶' },
  'fait': { infinitive: 'faire', translation: 'to do/make', emoji: '🛠️' },
  'veut': { infinitive: 'vouloir', translation: 'to want', emoji: '🙏' },
  'peut': { infinitive: 'pouvoir', translation: 'to be able to/can', emoji: '💪' },
  'aime': { infinitive: 'aimer', translation: 'to like/love', emoji: '❤️' }
};

export const conjugations = {
  'être': { 
    je: { form: 'suis', tip: "Irregular verb: je suis (I am)" },
    'il': { form: 'est', tip: 'Irregular verb: il est (he is)' },
    'elle': { form: 'est', tip: 'Irregular verb: elle est (she is)' },
    'ils': { form: 'sont', tip: 'Irregular verb: ils sont (they are)' },
    'elles': { form: 'sont', tip: 'Irregular verb: elles sont (they are)' }
  },
  'avoir': { 
    je: { form: 'ai', tip: "Irregular verb with elision: je + ai → j'ai (I have)" },
    'il': { form: 'a', tip: 'Irregular verb: il a (he has)' },
    'elle': { form: 'a', tip: 'Irregular verb: elle a (she has)' },
    'ils': { form: 'ont', tip: 'Irregular verb: ils ont (they have)' },
    'elles': { form: 'ont', tip: 'Irregular verb: elles ont (they have)' }
  },
  'aller': { 
    je: { form: 'vais', tip: 'Irregular verb: je vais (I go)' },
    'il': { form: 'va', tip: 'Irregular verb: il va (he goes)' },
    'elle': { form: 'va', tip: 'Irregular verb: elle va (she goes)' },
    'ils': { form: 'vont', tip: 'Irregular verb: ils vont (they go)' },
    'elles': { form: 'vont', tip: 'Irregular verb: elles vont (they go)' }
  },
  'faire': { 
    je: { form: 'fais', tip: 'Irregular verb: je fais (I do/make)' },
    'il': { form: 'fait', tip: 'Irregular verb: il fait (he does/makes)' },
    'elle': { form: 'fait', tip: 'Irregular verb: elle fait (she does/makes)' },
    'ils': { form: 'font', tip: 'Irregular verb: ils font (they do/make)' },
    'elles': { form: 'font', tip: 'Irregular verb: elles font (they do/make)' }
  },
  'vouloir': { 
    je: { form: 'veux', tip: 'Irregular verb: je veux (I want)' },
    'il': { form: 'veut', tip: 'Irregular verb: il veut (he wants)' },
    'elle': { form: 'veut', tip: 'Irregular verb: elle veut (she wants)' },
    'ils': { form: 'veulent', tip: 'Remember: -ent ending is silent! (they want)' },
    'elles': { form: 'veulent', tip: 'Remember: -ent ending is silent! (they want)' }
  },
  'pouvoir': { 
    je: { form: 'peux', tip: 'Irregular verb: je peux (I can)' },
    'il': { form: 'peut', tip: 'Irregular verb: il peut (he can)' },
    'elle': { form: 'peut', tip: 'Irregular verb: elle peut (she can)' },
    'ils': { form: 'peuvent', tip: 'Remember: -ent ending is silent! (they can)' },
    'elles': { form: 'peuvent', tip: 'Remember: -ent ending is silent! (they can)' }
  },
  'aimer': { 
    je: { form: 'aime', tip: "Regular -er verb with elision: je + aime → j'aime" },
    'il': { form: 'aime', tip: 'Regular -er verb: same as je form!' },
    'elle': { form: 'aime', tip: 'Regular -er verb: same as je form!' },
    'ils': { form: 'aiment', tip: 'Regular -er verb: add -ent (silent!)' },
    'elles': { form: 'aiment', tip: 'Regular -er verb: add -ent (silent!)' }
  }
};

export const sentenceTemplates = {
  'être': {
    je: { fr: 'Je suis', en: 'I am', gender: null },
    'il': { fr: 'Il est', en: 'He is', gender: 'masculine' },
    'elle': { fr: 'Elle est', en: 'She is', gender: 'feminine' },
    'ils': { fr: 'Ils sont', en: 'They are', gender: 'masculine' },
    'elles': { fr: 'Elles sont', en: 'They are', gender: 'feminine' }
  },
  'avoir': {
    je: { fr: "J'ai", en: 'I have', gender: null },
    'il': { fr: 'Il a', en: 'He has', gender: 'masculine' },
    'elle': { fr: 'Elle a', en: 'She has', gender: 'feminine' },
    'ils': { fr: 'Ils ont', en: 'They have', gender: 'masculine' },
    'elles': { fr: 'Elles ont', en: 'They have', gender: 'feminine' }
  },
  'aller': {
    je: { fr: 'Je vais', en: 'I go', gender: null },
    'il': { fr: 'Il va', en: 'He goes', gender: 'masculine' },
    'elle': { fr: 'Elle va', en: 'She goes', gender: 'feminine' },
    'ils': { fr: 'Ils vont', en: 'They go', gender: 'masculine' },
    'elles': { fr: 'Elles vont', en: 'They go', gender: 'feminine' }
  },
  'faire': {
    je: { fr: 'Je fais', en: 'I do', gender: null },
    'il': { fr: 'Il fait', en: 'He does', gender: 'masculine' },
    'elle': { fr: 'Elle fait', en: 'She does', gender: 'feminine' },
    'ils': { fr: 'Ils font', en: 'They do', gender: 'masculine' },
    'elles': { fr: 'Elles font', en: 'They do', gender: 'feminine' }
  },
  'vouloir': {
    je: { fr: 'Je veux', en: 'I want', gender: null },
    'il': { fr: 'Il veut', en: 'He wants', gender: 'masculine' },
    'elle': { fr: 'Elle veut', en: 'She wants', gender: 'feminine' },
    'ils': { fr: 'Ils veulent', en: 'They want', gender: 'masculine' },
    'elles': { fr: 'Elles veulent', en: 'They want', gender: 'feminine' }
  },
  'pouvoir': {
    je: { fr: 'Je peux', en: 'I can', gender: null },
    'il': { fr: 'Il peut', en: 'He can', gender: 'masculine' },
    'elle': { fr: 'Elle peut', en: 'She can', gender: 'feminine' },
    'ils': { fr: 'Ils peuvent', en: 'They can', gender: 'masculine' },
    'elles': { fr: 'Elles peuvent', en: 'They can', gender: 'feminine' }
  },
  'aimer': {
    je: { fr: "J'aime", en: 'I like', gender: null },
    'il': { fr: 'Il aime', en: 'He likes', gender: 'masculine' },
    'elle': { fr: 'Elle aime', en: 'She likes', gender: 'feminine' },
    'ils': { fr: 'Ils aiment', en: 'They like', gender: 'masculine' },
    'elles': { fr: 'Elles aiment', en: 'They like', gender: 'feminine' }
  }
};
