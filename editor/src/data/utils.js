const generateInspectorProps = (props) => {
  return props.fields.reduce(
    (obj, field) => ({ ...obj, [field.name]: field.initialValue }),
    {}
  );
};
const findRemovedIndex = (array1, array2) => {
  // Iterate through the arrays comparing elements
  for (let i = 0; i < array2.length; i++) {
    if (array1[i] !== array2[i]) {
      return i;
    }
  }

  // If no discrepancy found, the removed element is the last one
  return array1.length - 1;
};

export { generateInspectorProps, findRemovedIndex };
