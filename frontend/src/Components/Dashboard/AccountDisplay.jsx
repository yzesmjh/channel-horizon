
const AccountDisplay = ({amount, otherDetails}) => {
    const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});
const formattedCurrency = formatter.format(amount ||"00");

  return (
                  
                    <div className='w-full shadow-md rounded-lg p-10 mb-10 bg-white'>
                        <h1 className='font-medium text-4xl sm:text-7xl'> {formattedCurrency}</h1>
                        <small className='text-slate-400'>{otherDetails} Balance </small>
                    </div>

  )
}

export default AccountDisplay