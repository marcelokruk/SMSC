package io.smsc.repository.crud.crudClassMetaData;

import io.smsc.model.crud.CrudClassMetaData;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.transaction.annotation.Transactional;

/**
 * This REST repository class is used for providing default {@link JpaRepository}
 * CRUD methods to operate with {@link CrudClassMetaData} entities and exporting them
 * to appropriate endpoints.
 *
 * @author  Nazar Lipkovskyy
 * @since   0.0.1-SNAPSHOT
 */
@RepositoryRestResource(collectionResourceRel = "crud-class-meta-data", path = "crud-class-meta-data")
@Transactional(readOnly = true)
public interface CrudClassMetaDataRepository extends JpaRepository<CrudClassMetaData, Long> {

    //All query method resources are exposed under the resource 'search'.

    @Override
    @Transactional
    void delete(Long id);

    @Override
    @Transactional
    CrudClassMetaData save(CrudClassMetaData crudClassMetaData);

    @Override
    CrudClassMetaData findOne(Long id);

    CrudClassMetaData findByClassName(@Param("className") String className);

    @Override
    Page<CrudClassMetaData> findAll(Pageable pageable);
}
