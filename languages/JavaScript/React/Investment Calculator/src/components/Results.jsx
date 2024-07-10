import { calculateInvestmentResults, formatter } from "../util/investment"

export default function Results({input}){
    const resultData=calculateInvestmentResults(input);
    const initialInvestment = 
        resultData[0].valueEndOfYear -
        resultData[0].interest -
        resultData[0].annualInvestment;
    return (
        <table id="result">
            <thead>
                <th>Year</th>
                <th>Investment Value</th>
                <th>Interest </th>
                <th>Total Interest</th>
                <th>Invested Capital</th>
            </thead>
            <tbody>
                {
                    resultData.map((yearData)=>{
                        let year = yearData.year;
                        let annualInvestment = yearData.annualInvestment;
                        let valueEndOfYear = yearData.valueEndOfYear;
                        let interest = yearData.interest;

                        let totalInterest = valueEndOfYear - annualInvestment * year - initialInvestment; 
                        const totalAmountInvested = valueEndOfYear - totalInterest;
                        return (
                            <tr key={year}>
                                <td>{year}</td>
                                <td>{formatter.format(valueEndOfYear)}</td>
                                <td>{formatter.format(interest)}</td>
                                <td>{formatter.format(totalInterest)}</td>
                                <td>{formatter.format(totalAmountInvested)}</td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    )
}