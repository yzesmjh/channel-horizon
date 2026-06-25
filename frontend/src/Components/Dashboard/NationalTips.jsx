import React from 'react'

// Free images from Unsplash (no API key required, stable CDN links)
const TIPS_IMAGE = {
  piggy:    "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=160&h=160&fit=crop&auto=format",
  card:     "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=160&h=160&fit=crop&auto=format",
  home:     "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=160&h=160&fit=crop&auto=format",
  security: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=160&h=160&fit=crop&auto=format",
}

const NationalTips = () => {
  const cards = [
    {
      icon: TIPS_IMAGE.piggy,
      caption: "Auto Save",
      text: "Set a goal, save automatically with Channel Horizon Bank's Auto Save and track your progress.",
    },
    {
      icon: TIPS_IMAGE.card,
      caption: "Budget",
      text: "Monitor your budget and keep track of your spending with smart insights.",
    },
    {
      icon: TIPS_IMAGE.home,
      caption: "Home Option",
      text: "Your home buying, refinancing, and mortgage insights all in one place.",
    },
    {
      icon: TIPS_IMAGE.security,
      caption: "Security Tips",
      text: 'We will NEVER ask you to share your security details, such as your "COT" code or any sensitive account information.',
    },
  ]

  return (
    <div className="mb-10">
      <h1 className="border-b-[1px] border-b-slate-300 text-xs font-medium text-bankred pb-2">
        Horizon Tips
      </h1>
      <ul>
        {cards.map((item, index) => (
          <li className="flex gap-5 border-b-[1px] border-b-slate-300 p-5" key={index}>
            <div className="flex-shrink-0">
              <img
                src={item.icon}
                alt={`${item.caption} icon`}
                className="w-16 h-16 rounded-lg object-cover"
                loading="lazy"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-xs font-bold">{item.caption}</h1>
              <p className="text-slate-400 text-bankSmall">{item.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default NationalTips
