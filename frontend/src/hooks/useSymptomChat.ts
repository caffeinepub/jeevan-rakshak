import { useState, useCallback } from 'react';

export interface ChatMessage {
  id: string;
  role: 'bot' | 'user';
  text: string;
  timestamp: Date;
}

export type Symptom = 'Bukhar' | 'Khansi' | 'Dard' | 'Kamzori' | 'Aur';

const DISCLAIMER = '\n\n🩺 *Main ek AI hoon — doctor se milna sabse zaroori hai.*';

const SYMPTOM_ADVICE: Record<Symptom, string> = {
  Bukhar: `🌡️ **Bukhar (Fever) ke liye shuruati salah:**\n\n• Aaraam karein aur pani peete rahein — har ghante mein ek glass.\n• Thande kapde se mathe par seenk karein.\n• Paracetamol le sakte hain (doctor ki salah se).\n• Agar bukhar 103°F se zyada ho ya 3 din se zyada rahe, turant doctor ke paas jayein.${DISCLAIMER}`,
  Khansi: `😷 **Khansi (Cough) ke liye shuruati salah:**\n\n• Garam paani mein shahad aur adrak mila kar peeyein.\n• Steam lein — garam paani ke upar sar dhak kar.\n• Thanda paani aur ice cream se bachein.\n• Agar khansi mein khoon aaye ya 2 hafte se zyada ho, doctor se milein.${DISCLAIMER}`,
  Dard: `💊 **Dard (Pain) ke liye shuruati salah:**\n\n• Dard ki jagah par thanda ya garam seenk karein (jo zyada aaram de).\n• Aaraam karein aur zyada movement se bachein.\n• Paracetamol ya ibuprofen le sakte hain (doctor ki salah se).\n• Agar dard bahut tez ho ya achanak aaye, turant doctor se milein.${DISCLAIMER}`,
  Kamzori: `😴 **Kamzori (Weakness) ke liye shuruati salah:**\n\n• Pani aur electrolytes (nimbu paani, ORS) peeyein.\n• Halka khana khayein — daal, chawal, khichdi.\n• Poori neend lein — kam se kam 8 ghante.\n• Agar kamzori bahut zyada ho ya chakkar aayein, doctor se milein.${DISCLAIMER}`,
  Aur: `🏥 **Aapke lakshan ke baare mein:**\n\nKripya apne doctor ko apne sare lakshan batayein. Woh aapki sahi madad kar sakte hain.\n\n• Apne lakshan note karein — kab se hain, kitne tez hain.\n• Koi bhi dawa khud se na lein.\n• Agar koi bhi lakshan bahut tez ho, turant doctor ya 108 call karein.${DISCLAIMER}`,
};

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    role: 'bot',
    text: '🙏 **Namaste! Main Jeevan Rakshak hoon.**\n\nMain aapka AI health assistant hoon. Main aapki madad karne ke liye hamesha yahan hoon.\n\nKya aap ek bimar vyakti hain jo madad chahte hain?',
    timestamp: new Date(),
  },
];

interface SymptomChatHook {
  messages: ChatMessage[];
  stage: 'confirm' | 'symptoms' | 'chat';
  selectedSymptoms: Symptom[];
  confirmPatient: () => void;
  selectSymptom: (symptom: Symptom) => void;
  sendMessage: (text: string) => void;
  resetChat: () => void;
}

export function useSymptomChat(): SymptomChatHook {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [stage, setStage] = useState<'confirm' | 'symptoms' | 'chat'>('confirm');
  const [selectedSymptoms, setSelectedSymptoms] = useState<Symptom[]>([]);

  const addMessage = useCallback((role: 'bot' | 'user', text: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role,
      text,
      timestamp: new Date(),
    }]);
  }, []);

  const confirmPatient = useCallback(() => {
    addMessage('user', 'Haan, main madad chahta/chahti hoon.');
    setTimeout(() => {
      addMessage('bot', '💙 Theek hai, main samajhta/samajhti hoon. Aapko kaunse lakshan ho rahe hain?\n\nNeeche se apne lakshan chunein:');
      setStage('symptoms');
    }, 500);
  }, [addMessage]);

  const selectSymptom = useCallback((symptom: Symptom) => {
    setSelectedSymptoms(prev => {
      if (prev.includes(symptom)) return prev;
      return [...prev, symptom];
    });
    addMessage('user', `Mujhe ${symptom} ho raha/rahi hai.`);
    setTimeout(() => {
      addMessage('bot', SYMPTOM_ADVICE[symptom]);
      setStage('chat');
    }, 600);
  }, [addMessage]);

  const sendMessage = useCallback((text: string) => {
    addMessage('user', text);
    setTimeout(() => {
      addMessage('bot', `Aapki baat sun li. Kripya apne doctor se milein aur unhe ye sab batayein.${DISCLAIMER}`);
    }, 800);
  }, [addMessage]);

  const resetChat = useCallback(() => {
    setMessages(INITIAL_MESSAGES);
    setStage('confirm');
    setSelectedSymptoms([]);
  }, []);

  return { messages, stage, selectedSymptoms, confirmPatient, selectSymptom, sendMessage, resetChat };
}
