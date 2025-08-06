export async function getSelectedCategoryAction(
  handleCategorySelect,
  prevState,
  formData
) {
  const [selectedCategory] = formData.getAll("categories");
  handleCategorySelect(selectedCategory);
  
}
