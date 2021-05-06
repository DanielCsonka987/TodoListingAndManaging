import renderer from 'react-test-renderer'
import AboutContent from '../AboutContent'

test('AboutContent compontent snapshot test', ()=>{
    const tree = renderer.create(<AboutContent />)
        .toJSON();
    expect(tree).toMatchSnapshot();
})