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
      '&:hover': {backgroundColor: '#DAF2FF', cursor: 'pointer'},
      color: '#1f1f30',
      fontSize: '14px',
      boxShadow: '0px',
      border: "0px"

    };
  },
  input: styles => ({ ...styles, color:'#1f1f30', border: 'none', boxShadow: 'none', fontSize: '14px', }),
  container: (styles, state) => ({
    ...styles,
    boxSizing: 'border-box',
    fontSize: '14px',
    border: state.isFocused ? '1px solid #47c2ff' : '1px solid #d9d9d9',
    borderRadius: '4px' }),
  menu: styles => ({ ...styles, backgroundColor: '#fff', boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)'}),
  singleValue: (styles, { data }) => ({ ...styles, color:'#1f1f30', fontSize: '14px', }),
  indicatorSeparator: styles => ({ ...styles, display: 'none', boxShadow: 'none' }),
  placeholder: styles => ({ ...styles, color: 'lightgrey' }),
};
