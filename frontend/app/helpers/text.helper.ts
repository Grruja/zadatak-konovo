export const formatPrice = (price: number): string => {
  return price.toLocaleString('sr-RS', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const containsHtml = (text: string): boolean => {
  const htmlRegex = /<[^>]*>/; // Checks for HTML tags like <tags> or <tag />
  return htmlRegex.test(text);
}; 