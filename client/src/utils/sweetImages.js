// Utility function to get emoji images for sweets
export const getSweetImage = (name) => {
  const imageMap = {
    'Ras Malai': '🥛',
    'Gulab Jamun': '🫔',
    'Jalebi': '🍯',
    'Barfi': '🍮',
    'Ladoo': '🍪',
    'Kheer': '🥣',
    'Halwa': '🍮',
    'Peda': '🍮',
    'Rasgulla': '🥛',
    'Cham Cham': '🍡',
    'Sandesh': '🍚',
    'Mysore Pak': '🍯',
    'Badam Halwa': '🥜',
    'Besan Ladoo': '🟡',
    'Coconut Ladoo': '🥥',
    'Motichoor Ladoo': '🟠',
    'Kaju Katli': '💎',
    'Milk Cake': '🥛',
    'Khoya Barfi': '🍮',
    'Chivda': '🥜'
  }
  return imageMap[name] || '🍪'
}
