package kim.soov.springbootdeveloper;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class TestController {
    final private MemberService memberService;
    @GetMapping("/test")
    public List<Member> getAllMembers(){
        List<Member> members = memberService.getAllMembers();
        return members;
    }
}
