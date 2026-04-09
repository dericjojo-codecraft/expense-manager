const min = 48;
const max = 57;

// TODO: actually check for country code and real number
// a simple phone no. validator (9 digits)
export default function phoneValidator(phone: string) {
    if(
        phone.length === 9 && phone.split('').every(char => {
            const code = char.charCodeAt(0);
            return code >= min && code <= max;
        })
    ) {
        return true;
    }
    return false;
}