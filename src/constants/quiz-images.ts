// Hand-made image questions for Spot the Scam. Files live in
// assets/images/quiz/. Metro bundles only literal require() paths, so each
// image is listed here rather than discovered from the folder. Real alerts
// are mixed in on purpose so players learn what a genuine one looks like.
import type { BundledImageSource } from "@/types/quiz";

export type QuizImage = {
  source: BundledImageSource; // pixel size comes from the asset
  alt: string; // what the image shows, for screen readers
  kind: string; // message type in the card header ("Text message")
  from: string; // sender in the card header
  isScam: boolean;
  explanation: string; // the sign to remember
};

export const QUIZ_IMAGES: readonly QuizImage[] = [
  {
    source: require("@/assets/images/quiz/amazon-locked-email.png"),
    alt: "Email with the Amazon logo saying your account is locked. It says to call 555-5555 immediately and give your billing address, username, and password.",
    kind: "Email",
    from: "Amazon Customer Service",
    isScam: true,
    explanation:
      "It rushes you and asks for your username and password over the phone. Amazon never asks for your password, so check your account in the Amazon app instead.",
  },
  {
    source: require("@/assets/images/quiz/whatsapp-missed-call.jpg"),
    alt: "WhatsApp chat showing a missed voice call from an unknown number in Iran that is not in your contacts.",
    kind: "Missed call",
    from: "+98 ••• 4193",
    isScam: true,
    explanation:
      "A missed call from an unknown overseas number is often bait to get you to call back. Don't call back unknown numbers from other countries.",
  },
  {
    source: require("@/assets/images/quiz/loan-offer-text.png"),
    alt: "Text message to Gladys offering up to 5,000 in fast, unsecured funds, with a short link to log in.",
    kind: "Text message",
    from: "308-38",
    isScam: true,
    explanation:
      "Loan offers you didn't ask for, with a strange short link, are a common trap. Real lenders don't send surprise offers like this.",
  },
  {
    source: require("@/assets/images/quiz/pinnacle-bank-text.png"),
    alt: "Text message claiming to be Pinnacle Bank. It says there was unauthorized activity and to enter personal info at a short link to avoid suspension.",
    kind: "Text message",
    from: "8003929226@pinnba…",
    isScam: true,
    explanation:
      "It comes from an email address instead of a phone number, and the link asks for personal information. Banks don't ask for your details through a text link.",
  },
  {
    source: require("@/assets/images/quiz/credit-union-fraud-alert.png"),
    alt: "Text from 23618: Credit Union of Colorado fraud alert about a Visa card ending in 4771. Reply YES to verify now or NO, or call 866-317-9687.",
    kind: "Text message",
    from: "23618",
    isScam: false,
    explanation:
      "It only asks you to reply YES or NO and wants nothing private. If someone calls you afterward asking for a code, hang up and call the number on your card.",
  },
  {
    source: require("@/assets/images/quiz/fortera-fraud-alert.jpg"),
    alt: "Fortera Credit Union fraud alert texts asking whether you made a $1.50 purchase. Reply Y or N, with the bank's replies to each answer.",
    kind: "Text message",
    from: "919-37",
    isScam: false,
    explanation:
      "It only asks Y or N about a purchase and never asks for a code or password. To be extra sure, call the number on your card.",
  },
  {
    source: require("@/assets/images/quiz/nationwide-spoofed-text.jpg"),
    alt: "Texts from Nationwide. Older real messages warn never to share codes. The newest says: We'd like to check some activity on your card. You'll receive another message from a UK mobile number starting +44.",
    kind: "Text message",
    from: "Nationwide",
    isScam: true,
    explanation:
      "It shows up in your real bank's chat but points you to a regular mobile number. Scammers can fake the sender's name, so call the number on your card.",
  },
  {
    source: require("@/assets/images/quiz/chase-fraud-alert.jpg"),
    alt: "Chase Fraud text about a declined $25.00 charge, asking you to reply YES or NO. After YES, it thanks you for confirming.",
    kind: "Text message",
    from: "72166",
    isScam: false,
    explanation:
      "It names the exact charge and asks only YES or NO, with no link. Your bank will never ask you to read back a code, so call the number on your card if anything feels off.",
  },
  {
    source: require("@/assets/images/quiz/card-block-link-text.jpg"),
    alt: "Text in capital letters saying a card is blocked due to a $1080.56 charge, with a link to a webhop.org website to cancel.",
    kind: "Text message",
    from: "+1 (865) 404-1883",
    isScam: true,
    explanation:
      "It comes from a regular phone number and sends you to a strange website to cancel a charge. Check your account in your bank's own app instead.",
  },
  {
    source: require("@/assets/images/quiz/amex-fraud-alert.jpg"),
    alt: "Text from 256-84: Amex fraud alert asking if you tried to charge 130.63 USD. Reply 1 for yes or 2 to call Amex, with a 1-800 number.",
    kind: "Text message",
    from: "256-84",
    isScam: false,
    explanation:
      "It only asks you to reply 1 or 2 and wants nothing private. You can always check by calling the number on your card.",
  },
  {
    source: require("@/assets/images/quiz/paypal-declined-email.webp"),
    alt: "Email styled like PayPal saying your last transaction was declined, with a Confirm Now button. The sender address ends in hagia.online, and the link goes to mysp.ac.",
    kind: "Email",
    from: "service@paypal.com <…hagia.online>",
    isScam: true,
    explanation:
      "The real sender address isn't PayPal's, and the button goes to a strange website. Open the PayPal app yourself instead of tapping the link.",
  },
];
