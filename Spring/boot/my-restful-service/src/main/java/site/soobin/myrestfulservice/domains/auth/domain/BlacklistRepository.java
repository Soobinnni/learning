package site.soobin.myrestfulservice.domains.auth.domain;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BlacklistRepository extends CrudRepository<BlacklistedToken, String> {}
