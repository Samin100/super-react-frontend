// the styles for the selectors
export const selectStyles = {
  control: (base, state) => ({
    ...base,

    height: '34px',
    '&:hover': {
      cursor: 'pointer'
    },
    backgroundColor: '#fff',
    boxShadow: '0px',
    border: "0px",
  }),
  option: (styles, state) => {
    return {
      ...styles,
      backgroundColor: state.isSelected ? '#DAF2FF' : '#fff',
      '&:hover': { backgroundColor: '#DAF2FF', cursor: 'pointer' },
      color: '#1f1f30',
      fontSize: '14px',
      boxShadow: '0px',
      border: "0px"

    };
  },
  input: (styles) => ({ ...styles, color: '#1f1f30', border: 'none', boxShadow: 'none', fontSize: '14px', }),
  container: (styles, state) => ({
    ...styles,
    boxSizing: 'border-box',
    fontSize: '14px',
    border: state.isFocused ? '1px solid #47c2ff' : '1px solid #d9d9d9',
    borderRadius: '4px'
  }),
  menu: styles => ({ ...styles, backgroundColor: '#fff', boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)' }),
  singleValue: (styles, { data }) => ({ ...styles, color: '#1f1f30', fontSize: '14px', }),
  indicatorSeparator: styles => ({ ...styles, display: 'none', boxShadow: 'none' }),
  placeholder: styles => ({ ...styles, color: 'lightgrey' }),
};

export const selectStylesSmall = {
  control: (base, state) => ({
    ...base,
    lineHeight: '16px',
    '&:hover': {
      cursor: 'pointer'
    },
    backgroundColor: state.isDisabled ? "rgba(0,0,0,.05)" : '#fff',
    boxShadow: '0px',
    border: "0px",

  }),
  option: (styles, state) => {
    return {
      ...styles,
      backgroundColor: state.isSelected ? '#DAF2FF' : '#fff',
      '&:hover': { backgroundColor: '#DAF2FF', cursor: 'pointer' },
      color: '#1f1f30',
      fontSize: '12px',
      boxShadow: '0px',
      border: "0px",
      lineHeight: '16px',
      height: '27px'

    };
  },
  input: styles => ({
    ...styles,
    color: '#1f1f30',
    border: 'none',
    boxShadow: 'none',
    fontSize: '12px',
    lineHeight: '16px',
  }),
  container: (styles, state) => ({
    ...styles,
    boxSizing: 'border-box',
    fontSize: '12px',
    lineHeight: '12px',
    border: state.isFocused ? '1px solid #47c2ff' : '1px solid #d9d9d9',
    borderRadius: '4px',
    marginBottom: '15px',
  }),
  menu: styles => ({ ...styles, backgroundColor: '#fff', boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)' }),
  singleValue: (styles, { data }) => ({ ...styles, color: '#1f1f30', fontSize: '12px', lineHeight: '16px', }),
  indicatorSeparator: styles => ({ ...styles, display: 'none', boxShadow: 'none' }),
  placeholder: (styles, state) => ({ ...styles, color: state.isDisabled ? "rgba(0,0,0,0)" : 'lightgrey', lineHeight: '16px', }),
};


// the styles for the selectors that have been saved
export const selectStylesSaved = {
  control: (base, state) => ({
    ...base,
    width: '130px',
    height: '34px',
    '&:hover': {
      cursor: 'pointer'
    },
    backgroundColor: '#fff',
    border: state.isFocused ? '1px solid #d9d9d9' : '1px solid transparent',
    boxShadow: '0px',
  }),
  option: (styles, state) => {
    return {
      ...styles,
      backgroundColor: state.isSelected ? '#DAF2FF' : '#fff',
      '&:hover': { backgroundColor: '#DAF2FF', cursor: 'pointer' },
      color: '#1f1f30',
      fontSize: '14px',
      boxShadow: '0px',
      border: "0px",
      width: '130px',

    };
  },
  input: styles => ({ ...styles, color: '#1f1f30', border: 'none', boxShadow: 'none', fontSize: '14px', backgroundColor: 'transparent', width: '130px', }),
  container: (styles, state) => ({
    ...styles,
    backgroundColor: 'transparent',
    boxSizing: 'border-box',
    fontSize: '14px',
    border: state.isFocused ? '1px solid transparent' : '1px solid transparent',
    borderRadius: '4px',
  }),
  width: '130px',
  menu: styles => ({ ...styles, boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)', width: '130px', }),
  singleValue: (styles, { data }) => ({ ...styles, color: '#1f1f30', fontSize: '14px', width: '130px', }),
  indicatorSeparator: styles => ({ ...styles, display: 'none', boxShadow: 'none', width: '130px', }),
  placeholder: styles => ({ ...styles, color: 'lightgrey', width: '130px', }),
};
