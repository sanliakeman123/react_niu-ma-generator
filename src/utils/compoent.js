export function selectFilter(input, option) {
    if (option && option.key) {
        return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    } else {
        return true
    }
}