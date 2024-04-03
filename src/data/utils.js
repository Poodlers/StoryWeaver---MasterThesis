const generateInspectorProps = (props) => {
  return props.fields.reduce(
    (obj, field) => ({ ...obj, [field.name]: field.initialValue }),
    {}
  );
};

export { generateInspectorProps };
